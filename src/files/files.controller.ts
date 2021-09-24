import { Controller, Get, Param, Query, StreamableFile } from '@nestjs/common';
import { ImageQueryDto } from './dto/image-query.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/:uuid')
  async findOne(@Param('uuid') uuid: string) {
    return await this.filesService.findOne(uuid);
  }

  @Get(['/:uuid/download', '/:uuid/download/:filename'])
  async findOneImage(@Param('uuid') uuid: string, @Query() imageQuery: ImageQueryDto) {
    const imageBuffer = await this.filesService.getImage(uuid, imageQuery);
    return new StreamableFile(imageBuffer);
  }
}
