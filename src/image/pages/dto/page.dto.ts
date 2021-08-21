import { ApiProperty } from '@nestjs/swagger';

export class PageDto {
  @ApiProperty()
  number: string;
}
