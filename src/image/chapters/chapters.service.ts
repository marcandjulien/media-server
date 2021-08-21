import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Chapter } from 'src/entities/Chapter';
import { Page } from 'src/entities/Page';
import { Story } from 'src/entities/Story';
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

  async findOne(uuid: string) {
    const chapter = await this.chapterRepository.findOne(uuid);
    const pages = await this.pageRepository.find(
      { chapter },
      { orderBy: { number: QueryOrder.ASC } },
    );

    if (!chapter) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }

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
    return `This action removes a #${uuid} chapter`;
  }
}
