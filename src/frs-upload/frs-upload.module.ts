import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { FrsUploadController } from './controllers/frs-upload.controller';
import { FrsS3Service } from './services/frs-s3.service';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // Keep file in memory as Buffer — no temp disk writes
      limits: {
        fileSize: parseInt(process.env.MAX_DOCUMENT_BYTES || '209715200', 10), // 200 MB
        files: 1,
      },
    }),
  ],
  controllers: [FrsUploadController],
  providers: [FrsS3Service],
  exports: [FrsS3Service],
})
export class FrsUploadModule {}
