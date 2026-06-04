import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestScript, TestScriptDocument } from '../schemas/test-script.schema';

@Injectable()
export class TestScriptRepository {
  private readonly logger = new Logger(TestScriptRepository.name);

  constructor(
    @InjectModel(TestScript.name)
    private readonly model: Model<TestScriptDocument>,
  ) {}

  async insertMany(scripts: Partial<TestScript>[]): Promise<TestScriptDocument[]> {
    return this.model.insertMany(scripts) as unknown as TestScriptDocument[];
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    await this.model.deleteMany({ documentId });
  }

  async findByDocumentId(documentId: string): Promise<TestScriptDocument[]> {
    return this.model.find({ documentId }).sort({ testCaseType: 1, priority: 1 }).exec();
  }

  async countByDocumentId(documentId: string): Promise<number> {
    return this.model.countDocuments({ documentId });
  }

  async aggregateSummary(documentId: string): Promise<{
    byType: Record<string, number>;
    byTrack: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    const [typeAgg, trackAgg, priorityAgg] = await Promise.all([
      this.model.aggregate([
        { $match: { documentId } },
        { $group: { _id: '$testCaseType', count: { $sum: 1 } } },
      ]),
      this.model.aggregate([
        { $match: { documentId } },
        { $group: { _id: '$sourceTrack', count: { $sum: 1 } } },
      ]),
      this.model.aggregate([
        { $match: { documentId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      byType: Object.fromEntries(typeAgg.map((a) => [a._id, a.count])),
      byTrack: Object.fromEntries(trackAgg.map((a) => [a._id, a.count])),
      byPriority: Object.fromEntries(priorityAgg.map((a) => [a._id, a.count])),
    };
  }
}
