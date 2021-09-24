import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ImageQueryParam } from '../dto/image-query-param.dto';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Controller('image/chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  async create(@Body() createChapterDto: CreateChapterDto) {
    return await this.chaptersService.create(createChapterDto);
  }

  @Get()
  findAll() {
    return this.chaptersService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string, @Query() query: ImageQueryParam) {
    return this.chaptersService.findOne(uuid, query);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(uuid, updateChapterDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  async remove(@Param('uuid') uuid: string) {
    await this.chaptersService.remove(uuid);
  }
}
