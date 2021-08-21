import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MediaType } from 'src/entities/MediaType';
import { Page } from 'src/entities/Page';
import { Story } from 'src/entities/Story';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Injectable()
export class StoriesService {
  private readonly logger = new Logger(StoriesService.name);

  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: EntityRepository<Story>,
    @InjectRepository(Page)
    private readonly pageRepository: EntityRepository<Page>,
    @InjectRepository(MediaType)
    private readonly mediaTypeRepository: EntityRepository<MediaType>,
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
    return await this.storyRepository.findAll({ populate: true });
  }

  async findOne(uuid: string) {
    const story = await this.storyRepository.findOne(uuid, ['chapters.pages']);
    const pages = await this.pageRepository.find(
      { story },
      { orderBy: { number: QueryOrder.ASC } },
    );
    if (!story) {
      throw new HttpException('Story not found', HttpStatus.NOT_FOUND);
    }

    return { ...story, pages };
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

  remove(uuid: string) {
    return 'Not implemented yet!';
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
