import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isArray, isUUID } from 'class-validator';
import mkdirp from 'mkdirp';
import { createFilename, createPath } from 'src/commun/path';
import { Chapter } from 'src/entities/Chapter';
import { File } from 'src/entities/File';
import { FileProvider } from 'src/entities/FileProvider';
import { Page } from 'src/entities/Page';
import { Story } from 'src/entities/Story';
import { Tag } from 'src/entities/Tag';
import { FilesService } from 'src/files/files.service';
import { LongstripService } from '../longstrip/longstrip.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  private readonly logger = new Logger(PagesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
    private readonly longstripService: LongstripService,
    @InjectRepository(Page)
    private readonly pageRepository: EntityRepository<Page>,
    @InjectRepository(Chapter)
    private readonly chapterRepository: EntityRepository<Chapter>,
    @InjectRepository(Story)
    private readonly storyRepository: EntityRepository<Story>,
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
    @InjectRepository(FileProvider)
    private readonly fileProviderRepository: EntityRepository<FileProvider>,
  ) {}

  async create(createPageDto: CreatePageDto, file: Express.Multer.File) {
    const story = await this.storyRepository.findOneOrFail(createPageDto.storyUuid, ['mediaType']);
    const chapter = await this.chapterRepository.findOne(createPageDto.chapterUuid);

    // Create Folder if it does not exist
    const filesRoot = this.configService.get<string>('filesRoot');
    await mkdirp(createPath(filesRoot, story.title, chapter.title));

    // Process longstrip for trimming filler
    const imagesCoordinates = await this.longstripService.process(file);

    // Create pages
    const pages = [];
    for (const [index, imagesCoordinate] of imagesCoordinates.entries()) {
      const pageNumber =
        imagesCoordinates.length === 1
          ? createPageDto.number
          : `${createPageDto.number}_${index.toString().padStart(2, '0')}`;
      const region = imagesCoordinates.length === 1 ? undefined : imagesCoordinate;
      const fullpath = createPath(
        filesRoot,
        story.title,
        chapter.title,
        createFilename(pageNumber, 'png'),
      );

      const fileRecord = await this.filesService.saveImage(fullpath, file, region);
      const page = new Page(pageNumber);
      page.story = story;
      page.chapter = chapter;
      page.file = fileRecord;
      pages.push(page);
    }

    this.pageRepository.persistAndFlush(pages);
  }

  async findAll() {
    return await this.pageRepository.findAll();
  }

  async findOne(uuid: string) {
    const page = await this.pageRepository.findOne(uuid, ['tags', 'file']);

    if (!page) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }

    return page;
  }

  async update(uuid: string, updatePageDto: UpdatePageDto) {
    const page = await this.pageRepository.findOne(uuid, ['tags']);

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

    if (isArray(updatePageDto.tags)) {
      const tagsPromises = updatePageDto.tags.map((tag) => {
        // Retrieve tags entity from bd on uuid or name, if tag doesn't exist, create it
        if (isUUID(tag, 4)) {
          return this.tagRepository.findOneOrFail(tag);
        } else {
          return this.tagRepository.findOne({ name: tag }).then((value) => {
            if (!value) {
              const t = new Tag(tag);
              this.tagRepository.persist(t);
              return t;
            } else {
              return value;
            }
          });
        }
      });
      const tags = await Promise.all(tagsPromises);
      page.tags.set(tags);
    }

    this.pageRepository.persistAndFlush(page);
    return page;
  }

  async remove(uuid: string) {
    const page = await this.pageRepository.findOneOrFail(uuid, ['file']);

    this.fileRepository.remove(page.file);

    await this.pageRepository.removeAndFlush(page);
  }
}
