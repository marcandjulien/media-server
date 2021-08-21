import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  number: string;

  @IsUUID(4)
  @ApiProperty()
  storyUuid: string;
}
