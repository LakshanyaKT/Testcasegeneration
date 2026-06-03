import { Test, TestingModule } from '@nestjs/testing';
import { SectionDiscoveryService } from './section-discovery.service';

describe('SectionDiscoveryService', () => {
  let service: SectionDiscoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionDiscoveryService],
    }).compile();

    service = module.get<SectionDiscoveryService>(SectionDiscoveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('discoverSections', () => {
    it('should split markdown by headings', () => {
      const markdown = `# Section One\nContent for section one\n\n# Section Two\nContent for section two`;
      const sections = service.discoverSections(markdown);

      expect(sections.length).toBe(2);
      expect(sections[0].title).toBe('Section One');
      expect(sections[1].title).toBe('Section Two');
    });

    it('should handle multi-level headings', () => {
      const markdown = `# Main\n\n## Sub Section\nSub content\n\n### Deep\nDeep content`;
      const sections = service.discoverSections(markdown);

      expect(sections.length).toBe(3);
      expect(sections[0].title).toBe('Main');
      expect(sections[1].title).toBe('Sub Section');
      expect(sections[2].title).toBe('Deep');
    });

    it('should handle document with no headings', () => {
      const markdown = `This is plain text\nwith multiple lines\nbut no headings`;
      const sections = service.discoverSections(markdown);

      expect(sections.length).toBe(1);
      expect(sections[0].title).toBe('Document Content');
    });

    it('should preserve content including lists and tables', () => {
      const markdown = `# Requirements\n- Item 1\n- Item 2\n\n| Col | Col2 |\n|---|---|\n| A | B |`;
      const sections = service.discoverSections(markdown);

      expect(sections[0].content).toContain('- Item 1');
      expect(sections[0].content).toContain('| Col | Col2 |');
    });

    it('should detect page references', () => {
      const markdown = `# Section\n<!-- Page 5 -->\nContent here\n<!-- Page 7 -->`;
      const sections = service.discoverSections(markdown);

      expect(sections[0].pageRange.startPage).toBe(5);
      expect(sections[0].pageRange.endPage).toBe(7);
    });

    it('should filter out empty sections', () => {
      const markdown = `# Non-Empty\nContent\n\n# Empty\n\n# Also Non-Empty\nMore content`;
      const sections = service.discoverSections(markdown);

      const nonEmpty = sections.filter((s) => s.content.trim().length > 0);
      expect(nonEmpty.length).toBeGreaterThanOrEqual(2);
    });

    it('should generate unique section IDs', () => {
      const markdown = `# First\nContent\n\n# Second\nContent`;
      const sections = service.discoverSections(markdown);

      const ids = sections.map((s) => s.sectionId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
