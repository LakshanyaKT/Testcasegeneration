import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Clarification,
  ClarificationDocument,
  ClarificationStatus,
} from '../schemas/clarification.schema';
import { GeneratedClarification } from '../interfaces';

@Injectable()
export class ClarificationRepository {
  private readonly logger = new Logger(ClarificationRepository.name);

  constructor(
    @InjectModel(Clarification.name)
    private readonly clarificationModel: Model<ClarificationDocument>,
  ) {}

  async createMany(
    documentId: string,
    items: GeneratedClarification[],
  ): Promise<ClarificationDocument[]> {
    const docs = items.map((item, index) => ({
      clarificationId: `CLR-${documentId}-${Date.now()}-${index}`,
      documentId,
      question: item.question,
      reason: item.reason,
      answer: null,
      status: ClarificationStatus.PENDING,
    }));

    return this.clarificationModel.insertMany(docs) as unknown as ClarificationDocument[];
  }

  async findByDocumentId(documentId: string): Promise<ClarificationDocument[]> {
    return this.clarificationModel
      .find({ documentId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async findById(clarificationId: string): Promise<ClarificationDocument | null> {
    return this.clarificationModel.findOne({ clarificationId }).exec();
  }

  async updateAnswer(
    clarificationId: string,
    answer: string,
    status: ClarificationStatus,
  ): Promise<ClarificationDocument | null> {
    return this.clarificationModel.findOneAndUpdate(
      { clarificationId },
      { answer, status },
      { new: true },
    ).exec();
  }

  async markResolved(clarificationId: string): Promise<ClarificationDocument | null> {
    return this.clarificationModel.findOneAndUpdate(
      { clarificationId },
      { status: ClarificationStatus.RESOLVED },
      { new: true },
    ).exec();
  }
}
