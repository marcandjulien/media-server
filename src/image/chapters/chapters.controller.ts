import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PageFilterQueryDto } from '../pages/dto/page-filter-query.dto';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Controller('image/chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }

  @Get()
  findAll() {
    return this.chaptersService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string, @Query() pageFilterQuery: PageFilterQueryDto) {
    return this.chaptersService.findOne(uuid, pageFilterQuery);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(uuid, updateChapterDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.chaptersService.remove(uuid);
  }
}
