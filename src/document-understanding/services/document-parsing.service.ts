import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mammoth = require('mammoth');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require('pdf-parse');

export enum DocumentFormat {
  MARKDOWN = 'markdown',
  PDF = 'pdf',
  DOCX = 'docx',
  TEXT = 'text',
}

@Injectable()
export class DocumentParsingService {
  private readonly logger = new Logger(DocumentParsingService.name);

  /**
   * Detects document format from file extension or content type.
   */
  detectFormat(fileNameOrKey: string): DocumentFormat {
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

  /**
   * Parses a document buffer into markdown text.
   * Supports: PDF, DOCX, Markdown, Plain Text.
   */
  async parseToMarkdown(buffer: Buffer, fileName: string): Promise<string> {
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
        throw new BadRequestException(`Unsupported document format: ${format}`);
    }
  }

  /**
   * Parses PDF buffer to markdown-like text.
   * Preserves page markers for page range tracking.
   */
  private async parsePdf(buffer: Buffer): Promise<string> {
    this.logger.log('Parsing PDF document');

    try {
      const data = await pdf(buffer);

      if (!data.text || data.text.trim().length === 0) {
        throw new Error('PDF parsing returned empty text. The PDF may be image-based (scanned).');
      }

      this.logger.log(`PDF parsed: ${data.numpages} pages, ${data.text.length} chars`);

      // Add page markers and apply markdown inference
      const lines = data.text.split('\n');
      const result: string[] = [];
      let currentPage = 1;
      const linesPerPage = Math.ceil(lines.length / (data.numpages || 1));

      for (let i = 0; i < lines.length; i++) {
        if (i > 0 && i % linesPerPage === 0) {
          currentPage++;
          result.push(`\n<!-- Page ${currentPage} -->\n`);
        } else if (i === 0) {
          result.push(`<!-- Page 1 -->\n`);
        }
        result.push(this.inferMarkdown(lines[i]));
      }

      return result.join('\n');
    } catch (error) {
      this.logger.error(`PDF parsing failed: ${error.message}`);
      throw new BadRequestException(`Failed to parse PDF: ${error.message}`);
    }
  }

  /**
   * Basic heuristic to infer markdown formatting from raw text lines.
   * Detects headings, bullet points, and numbered lists.
   */
  private inferMarkdown(line: string): string {
    if (!line) return '';

    // Detect numbered headings like "1. Introduction" or "1.1 Overview"
    // Only if the line is short (< 80 chars) — likely a heading, not a paragraph
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

    // Detect bullet points
    if (line.match(/^[•●○▪▸►-]\s+/)) {
      return `- ${line.replace(/^[•●○▪▸►-]\s+/, '')}`;
    }

    // Detect numbered lists (only if it looks like a step, not a heading)
    if (line.match(/^\d+[.)]\s+/) && line.length > 80) {
      return line; // Keep as-is for long items
    }

    return line;
  }

  /**
   * Parses DOCX buffer to markdown.
   * mammoth preserves headings, lists, tables, and bold/italic.
   */
  private async parseDocx(buffer: Buffer): Promise<string> {
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
    } catch (error) {
      this.logger.error(`DOCX parsing failed: ${error.message}`);
      throw new BadRequestException(`Failed to parse DOCX: ${error.message}`);
    }
  }
}
