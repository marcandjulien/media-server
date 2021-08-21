import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePageDto {
  @IsString()
  @ApiProperty()
  number: string;

  @IsUUID(4)
  @ApiProperty()
  storyUuid: string;

  @IsOptional()
  @IsUUID(4)
  @ApiPropertyOptional()
  bookUuid: string;

  @IsOptional()
  @IsUUID(4)
  @ApiPropertyOptional()
  chapterUuid: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: string;

  @IsOptional()
  @ApiPropertyOptional()
  tags: string[];
}
