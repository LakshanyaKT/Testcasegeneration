export declare enum DocumentFormat {
    MARKDOWN = "markdown",
    PDF = "pdf",
    DOCX = "docx",
    TEXT = "text"
}
export declare class DocumentParsingService {
    private readonly logger;
    detectFormat(fileNameOrKey: string): DocumentFormat;
    parseToMarkdown(buffer: Buffer, fileName: string): Promise<string>;
    private parsePdf;
    private inferMarkdown;
    private parseDocx;
}
