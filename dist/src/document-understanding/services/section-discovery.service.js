"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SectionDiscoveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionDiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const id_generator_util_1 = require("../utils/id-generator.util");
let SectionDiscoveryService = SectionDiscoveryService_1 = class SectionDiscoveryService {
    constructor() {
        this.logger = new common_1.Logger(SectionDiscoveryService_1.name);
    }
    discoverSections(markdown) {
        this.logger.log('Starting section discovery');
        const lines = markdown.split('\n');
        const rawSections = this.extractRawSections(lines);
        if (rawSections.length === 0) {
            this.logger.warn('No headings found, treating entire document as single section');
            return [
                {
                    sectionId: (0, id_generator_util_1.generateSectionId)(0, 'document'),
                    title: 'Document Content',
                    content: markdown.trim(),
                    pageRange: this.detectPageRange(markdown, 0, lines.length - 1),
                },
            ];
        }
        const sections = rawSections.map((raw, index) => ({
            sectionId: (0, id_generator_util_1.generateSectionId)(index, raw.title),
            title: raw.title,
            content: raw.content.trim(),
            pageRange: this.detectPageRange(markdown, raw.lineStart, raw.lineEnd),
        }));
        const filteredSections = sections.filter((s) => s.content.length > 0);
        this.logger.log(`Discovered ${filteredSections.length} sections`);
        return filteredSections;
    }
    extractRawSections(lines) {
        const sections = [];
        let currentSection = null;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                if (currentSection) {
                    currentSection.lineEnd = i - 1;
                    currentSection.content = lines
                        .slice(currentSection.lineStart, i)
                        .join('\n');
                    sections.push(currentSection);
                }
                currentSection = {
                    title: headingMatch[2].trim(),
                    level: headingMatch[1].length,
                    content: '',
                    lineStart: i,
                    lineEnd: i,
                };
            }
        }
        if (currentSection) {
            currentSection.lineEnd = lines.length - 1;
            currentSection.content = lines
                .slice(currentSection.lineStart, lines.length)
                .join('\n');
            sections.push(currentSection);
        }
        return sections;
    }
    detectPageRange(_markdown, lineStart, lineEnd) {
        const lines = _markdown.split('\n').slice(lineStart, lineEnd + 1);
        const pageNumbers = [];
        for (const line of lines) {
            const patterns = [
                /<!--\s*[Pp]age\s*(\d+)\s*-->/g,
                /\[(?:[Pp]age|p\.?)\s*(\d+)\]/g,
                /(?:^|\s)[Pp]age\s+(\d+)(?:\s|$)/g,
            ];
            for (const pattern of patterns) {
                let match;
                while ((match = pattern.exec(line)) !== null) {
                    pageNumbers.push(parseInt(match[1], 10));
                }
            }
        }
        if (pageNumbers.length > 0) {
            return {
                startPage: Math.min(...pageNumbers),
                endPage: Math.max(...pageNumbers),
            };
        }
        const estimatedStartPage = Math.floor(lineStart / 50) + 1;
        const estimatedEndPage = Math.floor(lineEnd / 50) + 1;
        return {
            startPage: estimatedStartPage,
            endPage: estimatedEndPage,
        };
    }
};
exports.SectionDiscoveryService = SectionDiscoveryService;
exports.SectionDiscoveryService = SectionDiscoveryService = SectionDiscoveryService_1 = __decorate([
    (0, common_1.Injectable)()
], SectionDiscoveryService);
//# sourceMappingURL=section-discovery.service.js.map