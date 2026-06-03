"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DocumentProcessingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const document_schema_1 = require("../schemas/document.schema");
const document_chunk_schema_1 = require("../schemas/document-chunk.schema");
const interfaces_1 = require("../interfaces");
const section_discovery_service_1 = require("./section-discovery.service");
const semantic_chunking_service_1 = require("./semantic-chunking.service");
const chunk_classification_service_1 = require("./chunk-classification.service");
const knowledge_extraction_service_1 = require("./knowledge-extraction.service");
const s3_document_service_1 = require("./s3-document.service");
const document_parsing_service_1 = require("./document-parsing.service");
let DocumentProcessingService = DocumentProcessingService_1 = class DocumentProcessingService {
    constructor(documentModel, chunkModel, s3DocumentService, documentParsingService, sectionDiscoveryService, semanticChunkingService, chunkClassificationService, knowledgeExtractionService) {
        this.documentModel = documentModel;
        this.chunkModel = chunkModel;
        this.s3DocumentService = s3DocumentService;
        this.documentParsingService = documentParsingService;
        this.sectionDiscoveryService = sectionDiscoveryService;
        this.semanticChunkingService = semanticChunkingService;
        this.chunkClassificationService = chunkClassificationService;
        this.knowledgeExtractionService = knowledgeExtractionService;
        this.logger = new common_1.Logger(DocumentProcessingService_1.name);
    }
    async processDocument(dto) {
        const { documentId, s3Bucket, s3Key } = dto;
        this.logger.log(`Processing document: ${documentId}`);
        let markdown;
        if (dto.markdown) {
            this.logger.log('Using provided markdown content (skipping S3 download)');
            markdown = dto.markdown;
        }
        else {
            this.logger.log(`Step 0: Downloading document from s3://${s3Bucket}/${s3Key}`);
            const buffer = await this.s3DocumentService.downloadDocumentBuffer(s3Bucket, s3Key);
            this.logger.log(`Downloaded ${buffer.length} bytes, parsing to markdown...`);
            markdown = await this.documentParsingService.parseToMarkdown(buffer, s3Key);
        }
        this.logger.log('Step 1: Section Discovery');
        const sections = this.sectionDiscoveryService.discoverSections(markdown);
        this.logger.log(`Discovered ${sections.length} sections`);
        const allChunks = [];
        let globalChunkNumber = 0;
        for (const section of sections) {
            this.logger.log(`Step 2: Chunking section "${section.title}"`);
            const semanticChunks = await this.semanticChunkingService.chunkSection(section);
            for (const chunk of semanticChunks) {
                globalChunkNumber++;
                this.logger.log(`Step 3: Classifying chunk #${globalChunkNumber}`);
                const classification = await this.chunkClassificationService.classifyChunk(chunk);
                this.logger.log(`Step 4: Extracting knowledge from chunk #${globalChunkNumber}`);
                const extractedData = await this.knowledgeExtractionService.extractKnowledge(chunk, classification.chunkType);
                const summary = await this.knowledgeExtractionService.generateSummary(chunk);
                const chunkData = {
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
        this.logger.log('Step 5: Storing results in MongoDB');
        await this.storeResults(documentId, markdown, allChunks);
        const response = this.buildResponse(allChunks);
        this.logger.log(`Document ${documentId} processed: ${response.totalChunks} chunks ` +
            `(${response.requirementChunks} requirements, ${response.testCaseChunks} test cases, ${response.unknownChunks} unknown)`);
        return response;
    }
    async processLocalDocument(dto) {
        const { documentId, filePath } = dto;
        this.logger.log(`Processing local document: ${documentId} from ${filePath}`);
        const resolvedPath = path.resolve(filePath);
        if (!fs.existsSync(resolvedPath)) {
            throw new common_1.BadRequestException(`File not found: ${resolvedPath}`);
        }
        const buffer = fs.readFileSync(resolvedPath);
        this.logger.log(`Read local file: ${resolvedPath} (${buffer.length} bytes)`);
        const markdown = await this.documentParsingService.parseToMarkdown(buffer, resolvedPath);
        this.logger.log(`Parsed to markdown: ${markdown.length} chars`);
        return this.processDocument({
            documentId,
            s3Bucket: 'local',
            s3Key: filePath,
            markdown,
        });
    }
    async storeResults(documentId, markdown, chunks) {
        const requirementChunks = chunks.filter((c) => c.chunkType === interfaces_1.ChunkType.REQUIREMENT).length;
        const testCaseChunks = chunks.filter((c) => c.chunkType === interfaces_1.ChunkType.TEST_CASE).length;
        const unknownChunks = chunks.filter((c) => c.chunkType === interfaces_1.ChunkType.UNKNOWN).length;
        await this.documentModel.findOneAndUpdate({ documentId }, {
            documentId,
            originalMarkdown: markdown,
            status: 'PROCESSED',
            totalChunks: chunks.length,
            requirementChunks,
            testCaseChunks,
            unknownChunks,
        }, { upsert: true, new: true });
        await this.chunkModel.deleteMany({ documentId });
        if (chunks.length > 0) {
            await this.chunkModel.insertMany(chunks);
        }
    }
    buildResponse(chunks) {
        const requirementChunks = chunks.filter((c) => c.chunkType === interfaces_1.ChunkType.REQUIREMENT).length;
        const testCaseChunks = chunks.filter((c) => c.chunkType === interfaces_1.ChunkType.TEST_CASE).length;
        const unknownChunks = chunks.filter((c) => c.chunkType === interfaces_1.ChunkType.UNKNOWN).length;
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
};
exports.DocumentProcessingService = DocumentProcessingService;
exports.DocumentProcessingService = DocumentProcessingService = DocumentProcessingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(document_schema_1.DocumentEntity.name)),
    __param(1, (0, mongoose_1.InjectModel)(document_chunk_schema_1.DocumentChunk.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        s3_document_service_1.S3DocumentService,
        document_parsing_service_1.DocumentParsingService,
        section_discovery_service_1.SectionDiscoveryService,
        semantic_chunking_service_1.SemanticChunkingService,
        chunk_classification_service_1.ChunkClassificationService,
        knowledge_extraction_service_1.KnowledgeExtractionService])
], DocumentProcessingService);
//# sourceMappingURL=document-processing.service.js.map