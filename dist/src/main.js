"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AI-Powered Test Design Platform API')
        .setDescription('AI-powered document processing platform. Phases: (1) Document Processing, (2) Document Understanding & Analysis, (3) Clarification Generation, (4) Clarification Response Loop. Powered by AWS Bedrock Claude.')
        .setVersion('2.0.0')
        .addTag('Documents', 'Document processing endpoints')
        .addTag('Document Understanding', 'AI document analysis — modules, dependencies, risks, workflow')
        .addTag('Clarifications', 'Clarification question generation and response loop')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`AI Test Design Platform running on port ${port}`);
    logger.log(`Swagger docs available at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map