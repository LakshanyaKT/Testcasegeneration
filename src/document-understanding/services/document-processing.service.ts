import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

import { DocumentEntity } from '../schemas/document.schema';
import { DocumentUnderstanding } from '../schemas/document-understanding.schema';
import { ProjectKnowledge } from '../schemas/project-knowledge.schema';
import { Clarifications } from '../schemas/clarifications.schema';
import { TestCases } from '../schemas/test-cases.schema';
import { AgentRuns } from '../schemas/agent-runs.schema';

import {
  BedrockResponseContract,
  ProjectKnowledgeData,
} from '../interfaces';

import { LLMService } from './llm.service';
import { S3DocumentService } from './s3-document.service';
import { DocumentParsingService } from './document-parsing.service';

import {
  DOCUMENT_ANALYSIS_SYSTEM_PROMPT,
  DOCUMENT_ANALYSIS_USER_PROMPT,
} from '../prompts/document-analysis.prompt';

import { ProcessDocumentDto, ProcessLocalDocumentDto, ProcessDocumentResponseDto } from '../dto';

@Injectable()
export class DocumentProcessingService {
  private readonly logger = new Logger(DocumentProcessingService.name);

  constructor(
    @InjectModel(DocumentEntity.name)
    private readonly documentModel: Model<DocumentEntity>,
    @InjectModel(DocumentUnderstanding.name)
    private readonly documentUnderstandingModel: Model<DocumentUnderstanding>,
    @InjectModel(ProjectKnowledge.name)
    private readonly projectKnowledgeModel: Model<ProjectKnowledge>,
    @InjectModel(Clarifications.name)
    private readonly clarificationsModel: Model<Clarifications>,
    @InjectModel(TestCases.name)
    private readonly testCasesModel: Model<TestCases>,
    @InjectModel(AgentRuns.name)
    private readonly agentRunsModel: Model<AgentRuns>,

    private readonly s3DocumentService: S3DocumentService,
    private readonly documentParsingService: DocumentParsingService,
    private readonly llmService: LLMService,
  ) {}

  /**
   * Main processing pipeline:
   * S3 Download -> Retrieve Project Knowledge -> Send Full Document to Bedrock (single request) -> Decision Engine -> Store Results -> Log Run
   */
  async processDocument(dto: ProcessDocumentDto): Promise<ProcessDocumentResponseDto> {
    const { documentId, projectId, sessionId, s3Bucket, s3Key } = dto;
    const startedAt = new Date();
    this.logger.log(`Processing full document: ${documentId} for project: ${projectId}, session: ${sessionId}`);

    // Step 0: Download and parse document text
    let markdown: string;
    if (dto.markdown) {
      this.logger.log('Using provided markdown content (skipping S3 download)');
      markdown = dto.markdown;
    } else {
      this.logger.log(`Step 0: Downloading document from s3://${s3Bucket}/${s3Key}`);
      const buffer = await this.s3DocumentService.downloadDocumentBuffer(s3Bucket, s3Key);
      this.logger.log(`Downloaded ${buffer.length} bytes, parsing to markdown...`);
      markdown = await this.documentParsingService.parseToMarkdown(buffer, s3Key);
    }

    // Step 1: Save raw document metadata
    this.logger.log('Step 1: Saving document in MongoDB documents collection');
    await this.documentModel.findOneAndUpdate(
      { projectId, sessionId, fileName: dto.fileName || path.basename(s3Key || 'document.md') },
      {
        projectId,
        sessionId,
        fileName: dto.fileName || path.basename(s3Key || 'document.md'),
        fileType: dto.fileType || path.extname(s3Key || '.md').substring(1) || 'markdown',
        rawText: markdown,
        uploadedBy: dto.uploadedBy || 'system',
        uploadedAt: new Date(),
        status: 'UPLOADED',
      },
      { upsert: true, new: true },
    );

    // Step 2: Retrieve Relevant Project Knowledge
    this.logger.log('Step 2: Retrieving relevant project knowledge');
    let projectKnowledge = await this.projectKnowledgeModel.findOne({ projectId });
    if (!projectKnowledge) {
      this.logger.log(`No existing project knowledge found for project: ${projectId}. Creating new document...`);
      projectKnowledge = await this.projectKnowledgeModel.create({
        projectId,
        entities: [],
        businessRules: [],
        validations: [],
        processFlows: [],
        workflows: [],
        testPatterns: [],
        domainKnowledge: [],
        reusableScenarios: [],
      });
    }

    const projectKnowledgeContext: ProjectKnowledgeData = {
      entities: projectKnowledge.entities || [],
      businessRules: projectKnowledge.businessRules || [],
      validations: projectKnowledge.validations || [],
      processFlows: projectKnowledge.processFlows || [],
      workflows: projectKnowledge.workflows || [],
      testPatterns: projectKnowledge.testPatterns || [],
      domainKnowledge: projectKnowledge.domainKnowledge || [],
      reusableScenarios: projectKnowledge.reusableScenarios || [],
    };

    // Step 3: Call Amazon Bedrock for single-request analysis
    this.logger.log('Step 3: Sending full document text + project knowledge to Bedrock Claude Sonnet');
    
    const task = {
      analyzeDocument: true,
      extractRequirements: true,
      extractEntities: true,
      extractBusinessRules: true,
      extractValidations: true,
      extractProcessFlows: true,
      extractWorkflows: true,
      identifyMissingInformation: true,
      generateQuestions: true,
      generateTestCases: true,
      generateKnowledgeUpdates: true,
    };

    let bedrockResponse: BedrockResponseContract;
    try {
      bedrockResponse = await this.llmService.generateStructuredResponse<BedrockResponseContract>({
        systemPrompt: DOCUMENT_ANALYSIS_SYSTEM_PROMPT,
        userPrompt: DOCUMENT_ANALYSIS_USER_PROMPT(
          projectId,
          sessionId,
          markdown,
          projectKnowledgeContext,
          task,
        ),
        temperature: 0.2,
        maxTokens: 8192,
      });
    } catch (error) {
      this.logger.error(`Bedrock analysis invocation failed: ${error.message}`);
      throw new BadRequestException(`Bedrock analysis failed: ${error.message}`);
    }

    this.logger.log(`Bedrock response received. Status: ${bedrockResponse.status}, Questions generated: ${bedrockResponse.questions?.length || 0}`);

    // Step 4: Decision Engine and Storage
    this.logger.log('Step 4: Executing Decision Engine');
    
    // Save document_understanding regardless of path
    const moduleCount = new Set(bedrockResponse.requirements?.map((r) => r.module).filter(Boolean)).size;

    await this.documentUnderstandingModel.findOneAndUpdate(
      { documentId },
      {
        documentId,
        projectId,
        sessionId,
        analysis: {
          confidence: bedrockResponse.analysis?.confidence || 0,
          completenessScore: bedrockResponse.analysis?.completenessScore || 0,
          coverageScore: bedrockResponse.analysis?.coverageScore || 0,
          documentType: bedrockResponse.analysis?.documentType || 'FRS',
          moduleCount,
          requirementCount: bedrockResponse.requirements?.length || 0,
        },
        requirements: bedrockResponse.requirements || [],
        entities: bedrockResponse.entities || [],
        businessRules: bedrockResponse.businessRules || [],
        validations: bedrockResponse.validations || [],
        processFlows: bedrockResponse.processFlows || [],
        workflows: bedrockResponse.workflows || [],
        missingInformation: bedrockResponse.missingInformation || [],
        questions: bedrockResponse.questions || [],
        status: bedrockResponse.status,
      },
      { upsert: true, new: true },
    );

    const questionsCount = bedrockResponse.questions?.length || 0;

    if (questionsCount > 0) {
      this.logger.log('Decision Engine: Questions found. Saving Clarifications and returning NEEDS_CLARIFICATION.');
      
      await this.clarificationsModel.findOneAndUpdate(
        { documentId },
        {
          documentId,
          projectId,
          sessionId,
          questions: bedrockResponse.questions.map((q, idx) => ({
            questionId: q.questionId || `Q_AUTO_${String(idx + 1).padStart(3, '0')}`,
            question: q.question,
            category: q.category,
            priority: q.priority,
          })),
          answers: [],
          status: 'PENDING_USER',
        },
        { upsert: true, new: true },
      );
    } else {
      this.logger.log('Decision Engine: No questions found. Saving Test Cases and updating Project Knowledge.');
      
      // Save Test Cases
      await this.testCasesModel.findOneAndUpdate(
        { documentId },
        {
          documentId,
          projectId,
          sessionId,
          testCases: bedrockResponse.testCases || [],
          coverage: bedrockResponse.coverage || {
            requirementsCovered: 0,
            requirementsTotal: bedrockResponse.requirements?.length || 0,
            coveragePercentage: 0,
          },
        },
        { upsert: true, new: true },
      );

      // Update Project Knowledge
      const suggestedKnowledge = bedrockResponse.knowledgeBase?.projectKnowledge;
      if (suggestedKnowledge) {
        this.logger.log('Updating project knowledge collection from Bedrock suggestion payload');
        await this.projectKnowledgeModel.findOneAndUpdate(
          { projectId },
          {
            projectId,
            entities: suggestedKnowledge.entities || [],
            businessRules: suggestedKnowledge.businessRules || [],
            validations: suggestedKnowledge.validations || [],
            processFlows: suggestedKnowledge.processFlows || [],
            workflows: suggestedKnowledge.workflows || [],
            testPatterns: suggestedKnowledge.testPatterns || [],
            domainKnowledge: suggestedKnowledge.domainKnowledge || [],
            reusableScenarios: suggestedKnowledge.reusableScenarios || [],
          },
          { upsert: true, new: true },
        );
      }
    }

    // Step 5: Save Agent Run
    const completedAt = new Date();
    const executionTime = completedAt.getTime() - startedAt.getTime();
    this.logger.log(`Step 5: Logging agent execution metadata in agent_runs collection (Execution Time: ${executionTime}ms)`);
    
    await this.agentRunsModel.create({
      projectId,
      sessionId,
      documentId,
      status: bedrockResponse.status,
      startedAt,
      completedAt,
      bedrockCalls: 1,
      executionTime,
    });

    // Step 6: Construct response DTO
    return {
      status: bedrockResponse.status,
      documentId,
      projectId,
      sessionId,
      analysis: bedrockResponse.analysis,
      requirements: bedrockResponse.requirements,
      entities: bedrockResponse.entities,
      businessRules: bedrockResponse.businessRules,
      validations: bedrockResponse.validations,
      processFlows: bedrockResponse.processFlows,
      workflows: bedrockResponse.workflows,
      missingInformation: bedrockResponse.missingInformation,
      questions: bedrockResponse.status === 'NEEDS_CLARIFICATION' ? bedrockResponse.questions : undefined,
      testCases: bedrockResponse.status === 'READY' ? bedrockResponse.testCases : undefined,
      coverage: bedrockResponse.status === 'READY' ? bedrockResponse.coverage : undefined,
      nextAction: bedrockResponse.nextAction,
    };
  }

  /**
   * Test workflow: reads a local file and runs the full document-centric pipeline.
   * Supports PDF, DOCX, and Markdown files.
   */
  async processLocalDocument(dto: ProcessLocalDocumentDto): Promise<ProcessDocumentResponseDto> {
    const { documentId, projectId, sessionId, filePath } = dto;
    this.logger.log(`Processing local document: ${documentId} from ${filePath}`);

    const resolvedPath = path.resolve(filePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new BadRequestException(`File not found: ${resolvedPath}`);
    }

    const buffer = fs.readFileSync(resolvedPath);
    this.logger.log(`Read local file: ${resolvedPath} (${buffer.length} bytes)`);

    const markdown = await this.documentParsingService.parseToMarkdown(buffer, resolvedPath);
    this.logger.log(`Parsed local file to markdown: ${markdown.length} characters`);

    return this.processDocument({
      documentId,
      projectId,
      sessionId,
      s3Bucket: 'local',
      s3Key: filePath,
      markdown,
      fileName: path.basename(filePath),
      fileType: path.extname(filePath).substring(1),
    });
  }
}
