import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { TestCaseTypeDiscoveryService } from '../services/test-case-type-discovery.service';
import {
  TestCaseTypeSelectionResponseDto,
  ApproveTestCaseTypesDto,
} from '../dto';

@ApiTags('Test Case Types')
@Controller('test-case-types')
export class TestCaseTypesController {
  private readonly logger = new Logger(TestCaseTypesController.name);

  constructor(private readonly discoveryService: TestCaseTypeDiscoveryService) {}

  @Post(':documentId/discover')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Discover and suggest test case types for a document',
    description:
      'Reads document chunks, analysis, and resolved clarification answers. ' +
      'Claude detects test case types already present/implied in the document (detectedTypes) ' +
      'and recommends 2-3 additional types based on risk areas (suggestedTypes). ' +
      'Result stored in test_case_type_selections with status PENDING_APPROVAL.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({ status: 200, type: TestCaseTypeSelectionResponseDto })
  @ApiResponse({ status: 404, description: 'Analysis or chunks not found' })
  async discoverTestCaseTypes(
    @Param('documentId') documentId: string,
  ): Promise<TestCaseTypeSelectionResponseDto> {
    this.logger.log(`Discover test case types for: ${documentId}`);
    return this.discoveryService.discoverTestCaseTypes(documentId);
  }

  @Get(':documentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current test case type selection state',
    description:
      'Returns detected types, AI-suggested types, approved finalTypes, and current status. ' +
      'Status is PENDING_APPROVAL until the user calls /approve.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({ status: 200, type: TestCaseTypeSelectionResponseDto })
  @ApiResponse({ status: 404, description: 'No selection found — run discover first' })
  async getTypeSelection(
    @Param('documentId') documentId: string,
  ): Promise<TestCaseTypeSelectionResponseDto> {
    return this.discoveryService.getTypeSelection(documentId);
  }

  @Post(':documentId/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Approve and freeze the final test case types',
    description:
      'User submits their chosen types from the detected + suggested pool. ' +
      'Validates all submitted types are in the allowed set. ' +
      'Stores finalTypes and sets status to APPROVED. ' +
      'Test script generation is gated on this approval — POST /test-scripts/:documentId/generate will reject until APPROVED.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiBody({ type: ApproveTestCaseTypesDto })
  @ApiResponse({ status: 200, type: TestCaseTypeSelectionResponseDto, description: 'Types approved. Status set to APPROVED.' })
  @ApiResponse({ status: 400, description: 'Invalid types submitted — not in detected or suggested pool' })
  @ApiResponse({ status: 404, description: 'No selection found — run discover first' })
  async approveTypes(
    @Param('documentId') documentId: string,
    @Body() dto: ApproveTestCaseTypesDto,
  ): Promise<TestCaseTypeSelectionResponseDto> {
    this.logger.log(`Approve types for: ${documentId} — [${dto.approvedTypes.join(', ')}]`);
    return this.discoveryService.approveTypes(documentId, dto.approvedTypes);
  }
}
