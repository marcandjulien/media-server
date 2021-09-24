import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { isEmpty, isNil } from 'lodash';
import { Chapter } from 'src/entities/Chapter';
import { File } from 'src/entities/File';
import { MediaType } from 'src/entities/MediaType';
import { Page } from 'src/entities/Page';
import { Story } from 'src/entities/Story';
import { ImageQueryParam } from '../dto/image-query-param.dto';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Injectable()
export class StoriesService {
  private readonly logger = new Logger(StoriesService.name);

  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: EntityRepository<Story>,
    @InjectRepository(Chapter)
    private readonly chapterRepository: EntityRepository<Chapter>,
    @InjectRepository(Page)
    private readonly pageRepository: EntityRepository<Page>,
    @InjectRepository(MediaType)
    private readonly mediaTypeRepository: EntityRepository<MediaType>,
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
  ) {}

  async create(createStoryDto: CreateStoryDto) {
    const mediaType = await this.findOrCreateMediaType(createStoryDto.mediaType);
    const story = new Story(createStoryDto.title);
    story.mediaType = mediaType;
    await this.storyRepository.persistAndFlush(story);
    await this.storyRepository.populate(story, true);
    return story;
  }

  async findAll() {
    const stories = await this.storyRepository.findAll(['cover']); // tags?
    return stories;
  }

  goodChapter(chapter: Chapter) {
    return chapter.pages.getItems().some((page) =>
      page.tags
        .getItems()
        .map((t) => t.name)
        .includes('H Scene'),
    );
  }

  async findOne(uuid: string, query: ImageQueryParam) {
    const story = await this.storyRepository.findOne(uuid);

    if (!story) {
      throw new HttpException('Story not found', HttpStatus.NOT_FOUND);
    }

    let chapters;
    if (isEmpty(query.filter.pagesTags)) {
      chapters = await this.chapterRepository.find(
        { $and: [{ story: { $eq: story } }] },
        {
          populate: [...query.populate],
          orderBy: { sort: QueryOrder.ASC },
        },
      );
    } else {
      chapters = await this.chapterRepository.find(
        {
          $and: [{ story: { $eq: story } }, { pages: { tags: { name: query.filter.pagesTags } } }],
        },
        { populate: ['pages.tags', ...query.populate], orderBy: { sort: QueryOrder.ASC } },
      );
    }

    return {
      ...story,
      chapters,
    };
  }

  async update(uuid: string, updateStoryDto: UpdateStoryDto) {
    const story = await this.storyRepository.findOne(uuid);

    if (!story) {
      throw new HttpException('Story not found', HttpStatus.NOT_FOUND);
    }

    if (updateStoryDto.title) {
      story.title = updateStoryDto.title;
    }

    if (updateStoryDto.mediaType) {
      const mediaType = await this.findOrCreateMediaType(updateStoryDto.mediaType);
      story.mediaType = mediaType;
    }

    this.storyRepository.persistAndFlush(story);
    return story;
  }

  async remove(uuid: string) {
    const story = await this.storyRepository.findOneOrFail(uuid, [
      'books',
      'chapters',
      'pages.file',
    ]);

    const filesRecords = [
      story.cover,
      ...story.books.getItems().map((book) => book.cover),
      ...story.chapters.getItems().map((chapter) => chapter.cover),
      ...story.pages.getItems().map((page) => page.file),
    ].filter((file) => !isNil(file));
    filesRecords.forEach((file) => this.fileRepository.remove(file));

    await this.storyRepository.removeAndFlush(story);
  }

  async findOrCreateMediaType(name: string) {
    let mediaType = await this.mediaTypeRepository.findOne({ name });

    if (!mediaType) {
      mediaType = new MediaType(name);
      this.mediaTypeRepository.persist(mediaType);
    }
    return mediaType;
  }
}
