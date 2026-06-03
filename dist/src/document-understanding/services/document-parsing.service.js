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
var DocumentParsingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentParsingService = exports.DocumentFormat = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const mammoth = require('mammoth');
const pdf = require('pdf-parse');
var DocumentFormat;
(function (DocumentFormat) {
    DocumentFormat["MARKDOWN"] = "markdown";
    DocumentFormat["PDF"] = "pdf";
    DocumentFormat["DOCX"] = "docx";
    DocumentFormat["TEXT"] = "text";
})(DocumentFormat || (exports.DocumentFormat = DocumentFormat = {}));
let DocumentParsingService = DocumentParsingService_1 = class DocumentParsingService {
    constructor() {
        this.logger = new common_1.Logger(DocumentParsingService_1.name);
    }
    detectFormat(fileNameOrKey) {
        const ext = path.extname(fileNameOrKey).toLowerCase();
        switch (ext) {
            case '.pdf':
                return DocumentFormat.PDF;
            case '.docx':
                return DocumentFormat.DOCX;
            case '.md':
            case '.markdown':
                return DocumentFormat.MARKDOWN;
            case '.txt':
                return DocumentFormat.TEXT;
            default:
                this.logger.warn(`Unknown extension "${ext}", treating as plain text`);
                return DocumentFormat.TEXT;
        }
    }
    async parseToMarkdown(buffer, fileName) {
        const format = this.detectFormat(fileName);
        this.logger.log(`Parsing document "${fileName}" (format: ${format})`);
        switch (format) {
            case DocumentFormat.PDF:
                return this.parsePdf(buffer);
            case DocumentFormat.DOCX:
                return this.parseDocx(buffer);
            case DocumentFormat.MARKDOWN:
                return buffer.toString('utf-8');
            case DocumentFormat.TEXT:
                return buffer.toString('utf-8');
            default:
                throw new common_1.BadRequestException(`Unsupported document format: ${format}`);
        }
    }
    async parsePdf(buffer) {
        this.logger.log('Parsing PDF document');
        try {
            const data = await pdf(buffer);
            if (!data.text || data.text.trim().length === 0) {
                throw new Error('PDF parsing returned empty text. The PDF may be image-based (scanned).');
            }
            this.logger.log(`PDF parsed: ${data.numpages} pages, ${data.text.length} chars`);
            const lines = data.text.split('\n');
            const result = [];
            let currentPage = 1;
            const linesPerPage = Math.ceil(lines.length / (data.numpages || 1));
            for (let i = 0; i < lines.length; i++) {
                if (i > 0 && i % linesPerPage === 0) {
                    currentPage++;
                    result.push(`\n<!-- Page ${currentPage} -->\n`);
                }
                else if (i === 0) {
                    result.push(`<!-- Page 1 -->\n`);
                }
                result.push(this.inferMarkdown(lines[i]));
            }
            return result.join('\n');
        }
        catch (error) {
            this.logger.error(`PDF parsing failed: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to parse PDF: ${error.message}`);
        }
    }
    inferMarkdown(line) {
        if (!line)
            return '';
        if (line.length < 80) {
            const majorHeadingMatch = line.match(/^(\d+)\.\s+(.+)$/);
            if (majorHeadingMatch) {
                return `## ${majorHeadingMatch[1]}. ${majorHeadingMatch[2]}`;
            }
            const subHeadingMatch = line.match(/^(\d+\.\d+)\s+(.+)$/);
            if (subHeadingMatch) {
                return `### ${subHeadingMatch[1]} ${subHeadingMatch[2]}`;
            }
            const deepHeadingMatch = line.match(/^(\d+\.\d+\.\d+)\s+(.+)$/);
            if (deepHeadingMatch) {
                return `#### ${deepHeadingMatch[1]} ${deepHeadingMatch[2]}`;
            }
        }
        if (line.match(/^[•●○▪▸►-]\s+/)) {
            return `- ${line.replace(/^[•●○▪▸►-]\s+/, '')}`;
        }
        if (line.match(/^\d+[.)]\s+/) && line.length > 80) {
            return line;
        }
        return line;
    }
    async parseDocx(buffer) {
        this.logger.log('Parsing DOCX document');
        try {
            const result = await mammoth.convertToMarkdown({ buffer });
            if (result.messages && result.messages.length > 0) {
                for (const msg of result.messages) {
                    this.logger.warn(`DOCX parse warning: ${msg.message}`);
                }
            }
            if (!result.value || result.value.trim().length === 0) {
                throw new Error('DOCX parsing returned empty content');
            }
            this.logger.log(`DOCX parsed: ${result.value.length} chars`);
            return result.value;
        }
        catch (error) {
            this.logger.error(`DOCX parsing failed: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to parse DOCX: ${error.message}`);
        }
    }
};
exports.DocumentParsingService = DocumentParsingService;
exports.DocumentParsingService = DocumentParsingService = DocumentParsingService_1 = __decorate([
    (0, common_1.Injectable)()
], DocumentParsingService);
//# sourceMappingURL=document-parsing.service.js.map