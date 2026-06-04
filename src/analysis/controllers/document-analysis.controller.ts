import {
  Controller,
  Post,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { DocumentAnalysisService } from '../services/document-analysis.service';
import { AnalyzeDocumentResponseDto } from '../dto';

@ApiTags('Document Understanding')
@Controller('document-understanding')
export class DocumentAnalysisController {
  private readonly logger = new Logger(DocumentAnalysisController.name);

  constructor(private readonly documentAnalysisService: DocumentAnalysisService) {}

  @Post(':documentId/analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze a processed document',
    description:
      'Fetches all chunks for the document, aggregates summaries/requirements/test cases, and uses Claude to produce a comprehensive document understanding including identified modules, dependencies, risk areas, missing information, and workflow.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({
    status: 200,
    description: 'Document analysis completed successfully',
    type: AnalyzeDocumentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No chunks found — document must be processed first',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async analyzeDocument(
    @Param('documentId') documentId: string,
  ): Promise<AnalyzeDocumentResponseDto> {
    this.logger.log(`Received analysis request for document: ${documentId}`);
    return this.documentAnalysisService.analyzeDocument(documentId);
  }

  @Get(':documentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get existing document analysis',
    description: 'Retrieves the stored document understanding analysis for the given document ID.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({
    status: 200,
    description: 'Document analysis retrieved successfully',
    type: AnalyzeDocumentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Analysis not found — run analysis first via POST',
  })
  async getAnalysis(
    @Param('documentId') documentId: string,
  ): Promise<AnalyzeDocumentResponseDto> {
    return this.documentAnalysisService.getAnalysis(documentId);
  }
}
