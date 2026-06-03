import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Document Understanding API')
    .setDescription(
      'AI-powered document processing service that extracts Requirements and Test Cases from enterprise documents using semantic chunking and classification via AWS Bedrock.',
    )
    .setVersion('1.0.0')
    .addTag('Documents', 'Document processing endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Document Understanding Service running on port ${port}`);
  logger.log(`Swagger docs available at http://localhost:${port}/api`);
}

bootstrap();
