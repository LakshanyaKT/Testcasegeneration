import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RespondClarificationDto {
  @ApiProperty({
    description: 'The answer to the clarification question',
    example: 'Customer status must equal ACTIVE in the CRM system.',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  answer: string;
}
