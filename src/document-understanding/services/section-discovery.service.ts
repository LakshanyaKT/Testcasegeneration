import { Injectable, Logger } from '@nestjs/common';
import { Section, PageRange } from '../interfaces';
import { generateSectionId } from '../utils/id-generator.util';

interface MarkdownSection {
  title: string;
  level: number;
  content: string;
  lineStart: number;
  lineEnd: number;
}

@Injectable()
export class SectionDiscoveryService {
  private readonly logger = new Logger(SectionDiscoveryService.name);

  /**
   * Splits a markdown document into logical sections.
   * Preserves hierarchy, headings, lists, tables, and page references.
   */
  discoverSections(markdown: string): Section[] {
    this.logger.log('Starting section discovery');

    const lines = markdown.split('\n');
    const rawSections = this.extractRawSections(lines);

    if (rawSections.length === 0) {
      // If no headings found, treat the entire document as one section
      this.logger.warn('No headings found, treating entire document as single section');
      return [
        {
          sectionId: generateSectionId(0, 'document'),
          title: 'Document Content',
          content: markdown.trim(),
          pageRange: this.detectPageRange(markdown, 0, lines.length - 1),
        },
      ];
    }

    const sections: Section[] = rawSections.map((raw, index) => ({
      sectionId: generateSectionId(index, raw.title),
      title: raw.title,
      content: raw.content.trim(),
      pageRange: this.detectPageRange(markdown, raw.lineStart, raw.lineEnd),
    }));

    // Filter out empty sections
    const filteredSections = sections.filter((s) => s.content.length > 0);

    this.logger.log(`Discovered ${filteredSections.length} sections`);
    return filteredSections;
  }

  private extractRawSections(lines: string[]): MarkdownSection[] {
    const sections: MarkdownSection[] = [];
    let currentSection: MarkdownSection | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

      if (headingMatch) {
        // Save previous section
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

    // Don't forget the last section
    if (currentSection) {
      currentSection.lineEnd = lines.length - 1;
      currentSection.content = lines
        .slice(currentSection.lineStart, lines.length)
        .join('\n');
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Detects page references within a section.
   * Looks for patterns like <!-- Page X --> or [Page X] or similar markers.
   */
  private detectPageRange(
    _markdown: string,
    lineStart: number,
    lineEnd: number,
  ): PageRange {
    const lines = _markdown.split('\n').slice(lineStart, lineEnd + 1);
    const pageNumbers: number[] = [];

    for (const line of lines) {
      // Match various page reference patterns
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

    // Default: estimate based on line position (assume ~50 lines per page)
    const estimatedStartPage = Math.floor(lineStart / 50) + 1;
    const estimatedEndPage = Math.floor(lineEnd / 50) + 1;

    return {
      startPage: estimatedStartPage,
      endPage: estimatedEndPage,
    };
  }
}
