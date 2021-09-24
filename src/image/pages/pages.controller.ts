import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreatePageDto } from './dto/create-page.dto';
import { PageDto } from './dto/page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PagesService } from './pages.service';

@Controller('image/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new page',
    type: CreatePageDto,
  })
  @HttpCode(204)
  async create(@Body() createPageDto: CreatePageDto, @UploadedFile() file: Express.Multer.File) {
    await this.pagesService.create(createPageDto, file);
  }

  @Get()
  findAll(): Promise<PageDto[]> {
    return this.pagesService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<PageDto> {
    return this.pagesService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updatePageDto: UpdatePageDto): Promise<PageDto> {
    return this.pagesService.update(uuid, updatePageDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  async remove(@Param('uuid') uuid: string) {
    await this.pagesService.remove(uuid);
  }
}
