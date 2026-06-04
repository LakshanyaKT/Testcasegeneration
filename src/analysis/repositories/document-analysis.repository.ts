import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentAnalysis, DocumentAnalysisDocument } from '../schemas/document-analysis.schema';
import { DocumentAnalysisResult, AnalysisMetadata } from '../interfaces';

@Injectable()
export class DocumentAnalysisRepository {
  private readonly logger = new Logger(DocumentAnalysisRepository.name);

  constructor(
    @InjectModel(DocumentAnalysis.name)
    private readonly analysisModel: Model<DocumentAnalysisDocument>,
  ) {}

  async upsert(
    result: DocumentAnalysisResult,
    metadata: AnalysisMetadata,
  ): Promise<DocumentAnalysisDocument> {
    this.logger.log(`Upserting document analysis for: ${result.documentId}`);

    return this.analysisModel.findOneAndUpdate(
      { documentId: result.documentId },
      {
        documentId: result.documentId,
        overallSummary: result.overallSummary,
        identifiedModules: result.identifiedModules,
        dependencies: result.dependencies,
        riskAreas: result.riskAreas,
        missingInformation: result.missingInformation,
        workflow: result.workflow,
        metadata,
      },
      { upsert: true, new: true },
    );
  }

  async findByDocumentId(documentId: string): Promise<DocumentAnalysisDocument | null> {
    return this.analysisModel.findOne({ documentId }).exec();
  }
}
