import {
  Controller,
  Post,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TestScriptGenerationService } from '../services/test-script-generation.service';
import {
  GenerateTestScriptsResponseDto,
  GetTestScriptsResponseDto,
  TestScriptsSummaryDto,
} from '../dto';

@ApiTags('Test Scripts')
@Controller('test-scripts')
export class TestScriptsController {
  private readonly logger = new Logger(TestScriptsController.name);

  constructor(private readonly generationService: TestScriptGenerationService) {}

  @Post(':documentId/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate test scripts for a document',
    description:
      'Requires test case types to be APPROVED first (POST /test-case-types/:documentId/approve). ' +
      'Runs two parallel tracks: ' +
      'Track A — generates new scripts from REQUIREMENT chunks using requirements[] + finalTypes. ' +
      'Track B — enriches and extends existing TEST_CASE chunks covering all finalTypes. ' +
      'All resolved clarification answers are injected into both prompts as authoritative business rules. ' +
      'Clears and replaces any previously generated scripts for this document.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({
    status: 200,
    description: 'Test scripts generated. Returns full list grouped by type.',
    type: GenerateTestScriptsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Types not yet approved — run /approve first' })
  @ApiResponse({ status: 404, description: 'No type selection or chunks found' })
  async generateTestScripts(
    @Param('documentId') documentId: string,
  ): Promise<GenerateTestScriptsResponseDto> {
    this.logger.log(`Generate test scripts for: ${documentId}`);
    return this.generationService.generateTestScripts(documentId);
  }

  @Get(':documentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all generated test scripts for a document',
    description: 'Returns all test scripts grouped by testCaseType (Functional, Boundary Value, etc.).',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({ status: 200, type: GetTestScriptsResponseDto })
  async getTestScripts(
    @Param('documentId') documentId: string,
  ): Promise<GetTestScriptsResponseDto> {
    return this.generationService.getTestScripts(documentId);
  }

  @Get(':documentId/summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a count summary of generated test scripts',
    description: 'Returns total counts broken down by testCaseType, source track (REQUIREMENT/TEST_CASE), and priority (HIGH/MEDIUM/LOW).',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({ status: 200, type: TestScriptsSummaryDto })
  @ApiResponse({ status: 404, description: 'No scripts found — run generate first' })
  async getTestScriptsSummary(
    @Param('documentId') documentId: string,
  ): Promise<TestScriptsSummaryDto> {
    return this.generationService.getTestScriptsSummary(documentId);
  }
}
