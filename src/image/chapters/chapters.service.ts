import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { isEmpty, isNil } from 'lodash';
import { Chapter } from 'src/entities/Chapter';
import { File } from 'src/entities/File';
import { Page } from 'src/entities/Page';
import { Story } from 'src/entities/Story';
import { ImageQueryParam } from '../dto/image-query-param.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChaptersService {
  private readonly logger = new Logger(ChaptersService.name);

  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: EntityRepository<Page>,
    @InjectRepository(Chapter)
    private readonly chapterRepository: EntityRepository<Chapter>,
    @InjectRepository(Story)
    private readonly storyRepository: EntityRepository<Story>,
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
  ) {}

  async create(createChapterDto: CreateChapterDto) {
    const story = await this.storyRepository.findOneOrFail(createChapterDto.storyUuid);
    const chapter = new Chapter(createChapterDto.title, createChapterDto.number);
    chapter.story = story;
    await this.chapterRepository.persistAndFlush(chapter);
    await this.chapterRepository.populate(chapter, true);
    return chapter;
  }

  async findAll() {
    return await this.chapterRepository.findAll();
  }

  async findOne(uuid: string, query: ImageQueryParam) {
    const chapter = await this.chapterRepository.findOne(uuid);

    if (!chapter) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }

    const where = isEmpty(query.filter.pagesTags)
      ? []
      : [{ tags: { name: query.filter.pagesTags } }];

    const pages = await this.pageRepository.find(
      { $and: [{ chapter: { $eq: chapter } }, ...where] },
      { orderBy: { number: QueryOrder.ASC }, populate: ['tags'] },
    );

    // pages = this.filterPage(pages, pageFilterQuery);

    return { ...chapter, pages };
  }

  async update(uuid: string, updateChapterDto: UpdateChapterDto) {
    const chapter = await this.chapterRepository.findOne(uuid);

    if (!chapter) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }

    if (updateChapterDto.title) {
      chapter.title = updateChapterDto.title;
    }

    if (updateChapterDto.number) {
      chapter.number = updateChapterDto.number;
    }

    if (updateChapterDto.storyUuid) {
      const story = await this.storyRepository.findOneOrFail(updateChapterDto.storyUuid);
      chapter.story = story;
    }

    this.chapterRepository.persistAndFlush(chapter);
    return chapter;
  }

  async remove(uuid: string) {
    const chapter = await this.chapterRepository.findOneOrFail(uuid, ['pages.file']);

    const filesRecords = [
      chapter.cover,
      ...chapter.pages.getItems().map((page) => page.file),
    ].filter((file) => !isNil(file));
    filesRecords.forEach((file) => this.fileRepository.remove(file));

    await this.chapterRepository.removeAndFlush(chapter);
  }
}
