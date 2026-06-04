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
    .setTitle('AI-Powered Test Design Platform API')
    .setDescription(
      'AI-powered document processing platform. Phases: (1) Document Processing, (2) Document Understanding & Analysis, (3) Clarification Generation, (4) Clarification Response Loop. Powered by AWS Bedrock Claude.',
    )
    .setVersion('2.0.0')
    .addTag('Documents', 'Document processing endpoints')
    .addTag('Document Understanding', 'AI document analysis — modules, dependencies, risks, workflow')
    .addTag('Clarifications', 'Clarification question generation and response loop')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`AI Test Design Platform running on port ${port}`);
  logger.log(`Swagger docs available at http://localhost:${port}/api`);
}

bootstrap();
