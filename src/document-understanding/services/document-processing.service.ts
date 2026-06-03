import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentEntity, DocumentEntityDocument } from '../schemas/document.schema';
import { DocumentChunk, DocumentChunkDocument } from '../schemas/document-chunk.schema';
import { ChunkType, DocumentChunkData } from '../interfaces';
import { SectionDiscoveryService } from './section-discovery.service';
import { SemanticChunkingService } from './semantic-chunking.service';
import { ChunkClassificationService } from './chunk-classification.service';
import { KnowledgeExtractionService } from './knowledge-extraction.service';
import { S3DocumentService } from './s3-document.service';
import { DocumentParsingService } from './document-parsing.service';
import { ProcessDocumentDto, ProcessLocalDocumentDto, ProcessDocumentResponseDto } from '../dto';

@Injectable()
export class DocumentProcessingService {
  private readonly logger = new Logger(DocumentProcessingService.name);

  constructor(
    @InjectModel(DocumentEntity.name)
    private readonly documentModel: Model<DocumentEntityDocument>,
    @InjectModel(DocumentChunk.name)
    private readonly chunkModel: Model<DocumentChunkDocument>,
    private readonly s3DocumentService: S3DocumentService,
    private readonly documentParsingService: DocumentParsingService,
    private readonly sectionDiscoveryService: SectionDiscoveryService,
    private readonly semanticChunkingService: SemanticChunkingService,
    private readonly chunkClassificationService: ChunkClassificationService,
    private readonly knowledgeExtractionService: KnowledgeExtractionService,
  ) {}

  /**
   * Main processing pipeline:
   * S3 Download → Section Discovery → AI Semantic Chunking → Classification → Knowledge Extraction → Storage
   */
  async processDocument(dto: ProcessDocumentDto): Promise<ProcessDocumentResponseDto> {
    const { documentId, s3Bucket, s3Key } = dto;
    this.logger.log(`Processing document: ${documentId}`);

    // Step 0: Download document from S3 (or use provided markdown)
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

    // Step 1: Section Discovery
    this.logger.log('Step 1: Section Discovery');
    const sections = this.sectionDiscoveryService.discoverSections(markdown);
    this.logger.log(`Discovered ${sections.length} sections`);

    // Step 2 & 3 & 4: Semantic Chunking + Classification + Knowledge Extraction
    const allChunks: DocumentChunkData[] = [];
    let globalChunkNumber = 0;

    for (const section of sections) {
      // Step 2: Semantic Chunking
      this.logger.log(`Step 2: Chunking section "${section.title}"`);
      const semanticChunks = await this.semanticChunkingService.chunkSection(section);

      for (const chunk of semanticChunks) {
        globalChunkNumber++;

        // Step 3: Classification
        this.logger.log(`Step 3: Classifying chunk #${globalChunkNumber}`);
        const classification =
          await this.chunkClassificationService.classifyChunk(chunk);

        // Step 4: Knowledge Extraction
        this.logger.log(`Step 4: Extracting knowledge from chunk #${globalChunkNumber}`);
        const extractedData = await this.knowledgeExtractionService.extractKnowledge(
          chunk,
          classification.chunkType,
        );

        // Generate summary
        const summary = await this.knowledgeExtractionService.generateSummary(chunk);

        const chunkData: DocumentChunkData = {
          documentId,
          chunkNumber: globalChunkNumber,
          chunkType: classification.chunkType,
          title: chunk.title,
          pageRange: section.pageRange,
          content: chunk.content,
          summary,
          classification: {
            chunkType: classification.chunkType,
            confidence: classification.confidence,
          },
          extractedData,
          processing: {
            chunkingStrategy: 'AI_SEMANTIC',
            summaryGenerated: true,
            extractionCompleted: true,
          },
        };

        allChunks.push(chunkData);
      }
    }

    // Step 5: MongoDB Storage
    this.logger.log('Step 5: Storing results in MongoDB');
    await this.storeResults(documentId, markdown, allChunks);

    // Build response
    const response = this.buildResponse(allChunks);
    this.logger.log(
      `Document ${documentId} processed: ${response.totalChunks} chunks ` +
        `(${response.requirementChunks} requirements, ${response.testCaseChunks} test cases, ${response.unknownChunks} unknown)`,
    );

    return response;
  }

  /**
   * Test workflow: reads a local file and runs the full pipeline.
   * Supports PDF, DOCX, and Markdown files.
   * Local File → Parse to Markdown → Section Discovery → AI Semantic Chunking → Classification → Knowledge Extraction → Storage
   */
  async processLocalDocument(dto: ProcessLocalDocumentDto): Promise<ProcessDocumentResponseDto> {
    const { documentId, filePath } = dto;
    this.logger.log(`Processing local document: ${documentId} from ${filePath}`);

    // Resolve the file path
    const resolvedPath = path.resolve(filePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new BadRequestException(`File not found: ${resolvedPath}`);
    }

    // Read as buffer (required for PDF/DOCX binary formats)
    const buffer = fs.readFileSync(resolvedPath);
    this.logger.log(`Read local file: ${resolvedPath} (${buffer.length} bytes)`);

    // Parse to markdown based on file extension
    const markdown = await this.documentParsingService.parseToMarkdown(buffer, resolvedPath);
    this.logger.log(`Parsed to markdown: ${markdown.length} chars`);

    // Reuse the main pipeline with the markdown content
    return this.processDocument({
      documentId,
      s3Bucket: 'local',
      s3Key: filePath,
      markdown,
    });
  }

  private async storeResults(
    documentId: string,
    markdown: string,
    chunks: DocumentChunkData[],
  ): Promise<void> {
    const requirementChunks = chunks.filter(
      (c) => c.chunkType === ChunkType.REQUIREMENT,
    ).length;
    const testCaseChunks = chunks.filter(
      (c) => c.chunkType === ChunkType.TEST_CASE,
    ).length;
    const unknownChunks = chunks.filter(
      (c) => c.chunkType === ChunkType.UNKNOWN,
    ).length;

    // Upsert the document record
    await this.documentModel.findOneAndUpdate(
      { documentId },
      {
        documentId,
        originalMarkdown: markdown,
        status: 'PROCESSED',
        totalChunks: chunks.length,
        requirementChunks,
        testCaseChunks,
        unknownChunks,
      },
      { upsert: true, new: true },
    );

    // Remove existing chunks for this document (re-processing support)
    await this.chunkModel.deleteMany({ documentId });

    // Insert all new chunks
    if (chunks.length > 0) {
      await this.chunkModel.insertMany(chunks);
    }
  }

  private buildResponse(chunks: DocumentChunkData[]): ProcessDocumentResponseDto {
    const requirementChunks = chunks.filter(
      (c) => c.chunkType === ChunkType.REQUIREMENT,
    ).length;
    const testCaseChunks = chunks.filter(
      (c) => c.chunkType === ChunkType.TEST_CASE,
    ).length;
    const unknownChunks = chunks.filter(
      (c) => c.chunkType === ChunkType.UNKNOWN,
    ).length;

    return {
      totalChunks: chunks.length,
      requirementChunks,
      testCaseChunks,
      unknownChunks,
      chunks: chunks.map((chunk) => ({
        _id: '',
        documentId: chunk.documentId,
        chunkNumber: chunk.chunkNumber,
        chunkType: chunk.chunkType,
        title: chunk.title,
        pageRange: chunk.pageRange,
        content: chunk.content,
        summary: chunk.summary,
        classification: { confidence: chunk.classification.confidence },
        extractedData: chunk.extractedData,
        processing: chunk.processing,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };
  }
}
