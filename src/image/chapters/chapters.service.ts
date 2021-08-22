import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Chapter } from 'src/entities/Chapter';
import { Page } from 'src/entities/Page';
import { Story } from 'src/entities/Story';
import { PageFilterQueryDto } from '../pages/dto/page-filter-query.dto';
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

  formatWhere(pageFilterQuery: PageFilterQueryDto) {
    // Not working
    const whereCondition = [];
    if (pageFilterQuery?.skipTags?.length) {
      whereCondition.push({ tags: { $nin: pageFilterQuery?.skipTags } });
    }

    if (pageFilterQuery?.onlyTags?.length) {
    }

    return whereCondition;
  }

  filterPage(pages: Page[], pageFilterQuery: PageFilterQueryDto) {
    return pages.filter((page) => {
      if (
        pageFilterQuery?.skipTags?.length > 0 &&
        pageFilterQuery.skipTags.filter((t) =>
          page.tags
            .toArray()
            .map((pt) => pt.name)
            .includes(t),
        ).length > 0
      ) {
        return false;
      }

      if (
        pageFilterQuery?.onlyTags?.length > 0 &&
        pageFilterQuery.onlyTags.filter((t) =>
          page.tags
            .toArray()
            .map((pt) => pt.name)
            .includes(t),
        ).length === 0
      ) {
        return false;
      }

      return true;
    });
  }

  async findOne(uuid: string, pageFilterQuery: PageFilterQueryDto) {
    const chapter = await this.chapterRepository.findOne(uuid, ['pages.tags']);

    let pages = await this.pageRepository.find(
      { $and: [{ chapter: { $eq: chapter } }] },
      { orderBy: { number: QueryOrder.ASC } },
    );

    pages = this.filterPage(pages, pageFilterQuery);

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
