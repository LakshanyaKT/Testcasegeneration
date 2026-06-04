import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TestCaseTypeSelection,
  TestCaseTypeSelectionDocument,
  TestCaseTypeSelectionStatus,
  SuggestedTestCaseType,
} from '../schemas/test-case-type-selection.schema';

@Injectable()
export class TestCaseTypeSelectionRepository {
  private readonly logger = new Logger(TestCaseTypeSelectionRepository.name);

  constructor(
    @InjectModel(TestCaseTypeSelection.name)
    private readonly model: Model<TestCaseTypeSelectionDocument>,
  ) {}

  async upsertDiscovery(
    documentId: string,
    detectedTypes: string[],
    suggestedTypes: SuggestedTestCaseType[],
  ): Promise<TestCaseTypeSelectionDocument> {
    return this.model.findOneAndUpdate(
      { documentId },
      {
        documentId,
        detectedTypes,
        suggestedTypes,
        finalTypes: [],
        status: TestCaseTypeSelectionStatus.PENDING_APPROVAL,
      },
      { upsert: true, new: true },
    );
  }

  async approve(
    documentId: string,
    finalTypes: string[],
  ): Promise<TestCaseTypeSelectionDocument | null> {
    return this.model.findOneAndUpdate(
      { documentId },
      { finalTypes, status: TestCaseTypeSelectionStatus.APPROVED },
      { new: true },
    );
  }

  async findByDocumentId(documentId: string): Promise<TestCaseTypeSelectionDocument | null> {
    return this.model.findOne({ documentId }).exec();
  }
}
