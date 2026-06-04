import { ApiProperty } from '@nestjs/swagger';
import { ClarificationResponseDto } from './clarification-response.dto';
import { AnalyzeDocumentResponseDto } from '../../analysis/dto';

export class RespondClarificationResponseDto {
  @ApiProperty({ type: ClarificationResponseDto })
  clarification: ClarificationResponseDto;

  @ApiProperty({ type: AnalyzeDocumentResponseDto })
  updatedAnalysis: AnalyzeDocumentResponseDto;
}
