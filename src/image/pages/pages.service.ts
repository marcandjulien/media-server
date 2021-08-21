import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isString } from 'lodash';
import mkdirp from 'mkdirp';
import path from 'path';
import sharp from 'sharp';
import { Chapter } from 'src/entities/Chapter';
import { Page } from 'src/entities/Page';
import { Story } from 'src/entities/Story';
import { LongstripService } from '../longstrip/longstrip.service';
import { CreatePageDto } from './dto/create-page.dto';
import { ImageQueryDto, SharpFitType } from './dto/image-query.dto';
import { UpdatePageDto } from './dto/update-page.dto';

const createPath = (...parts: string[]) => path.join(...parts.filter((part) => isString(part)));

const createDirectoryPath = (...parts: string[]) =>
  parts.filter((part) => isString(part)).join('/');
const createFilename = (filename: string, extension: string) => [filename, extension].join('.');
const createFullPath = (directoryPath: string, filename: string) =>
  [directoryPath, filename].join('/');

@Injectable()
export class PagesService {
  private readonly logger = new Logger(PagesService.name);

  constructor(
    private configService: ConfigService,
    private readonly longstripService: LongstripService,
    @InjectRepository(Page)
    private readonly pageRepository: EntityRepository<Page>,
    @InjectRepository(Chapter)
    private readonly chapterRepository: EntityRepository<Chapter>,
    @InjectRepository(Story)
    private readonly storyRepository: EntityRepository<Story>,
  ) {}

  async create(createPageDto: CreatePageDto, file: Express.Multer.File) {
    const story = await this.storyRepository.findOneOrFail(createPageDto.storyUuid, ['mediaType']);
    const chapter = await this.chapterRepository.findOne(createPageDto.chapterUuid);

    // Create Folder if it does not exist
    const filesRoot = this.configService.get<string>('filesRoot');
    await mkdirp(createPath(filesRoot, story.title, chapter.title));

    // Process longstrip for trimming filler
    const imagesCoordinates = await this.longstripService.process(file);

    // Create page
    const pages = [];
    if (imagesCoordinates.length === 1) {
      const page = new Page(createPageDto.number);
      const fullpath = createPath(
        filesRoot,
        story.title,
        chapter.title,
        createFilename(page.number, 'png'),
      );
      page.fullpath = fullpath;
      page.filename = fullpath.split('/').slice(-1)[0];
      page.story = story;
      page.chapter = chapter;

      try {
        await sharp(file.buffer).toFile(page.fullpath);
        pages.push(page);
      } catch (err) {
        this.logger.error(err);
      }
    } else {
      const promises = imagesCoordinates.map(async (coordinate, index) => {
        const page = new Page(`${createPageDto.number}_${index}`);
        const fullpath = path.join(
          filesRoot,
          story.title,
          chapter.title,
          createFilename(`${page.number}_${index}`, 'png'),
        );
        page.fullpath = fullpath;
        page.filename = fullpath.split('/').slice(-1)[0];
        page.story = story;
        page.chapter = chapter;
        return sharp(file.buffer)
          .extract(coordinate)
          .toFile(page.fullpath)
          .then(() => pages.push(page))
          .catch((err) => this.logger.error(err));
      });

      await Promise.all(promises);
    }

    this.pageRepository.persistAndFlush(pages);
  }

  async findAll() {
    return await this.pageRepository.findAll();
  }

  async findOne(uuid: string) {
    const page = await this.pageRepository.findOne(uuid);

    if (!page) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }

    return page;
  }

  async update(uuid: string, updatePageDto: UpdatePageDto) {
    const page = await this.pageRepository.findOne(uuid);

    if (!page) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }

    if (updatePageDto.number) {
      page.number = updatePageDto.number;
    }

    if (updatePageDto.storyUuid) {
      const story = await this.storyRepository.findOneOrFail(updatePageDto.storyUuid);
      page.story = story;
    }

    if (updatePageDto.chapterUuid) {
      const chapter = await this.chapterRepository.findOne(updatePageDto.chapterUuid);
      page.chapter = chapter;
    }

    this.pageRepository.persistAndFlush(page);
    return page;
  }

  async remove(uuid: string) {
    return `This action removes a #${uuid} page`;
  }

  async getImage(uuid: string, imageQuery: ImageQueryDto) {
    const page = await this.pageRepository.findOneOrFail(uuid);

    const promise = sharp(page.fullpath);
    if (imageQuery.width || imageQuery.height) {
      promise.resize({
        width: imageQuery.width,
        height: imageQuery.height,
        fit: imageQuery.fit || SharpFitType.CONTAIN,
      });
    }

    const imageBuffer = await promise.toBuffer();
    return imageBuffer;
  }
}
