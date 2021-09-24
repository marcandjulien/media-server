import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BinaryToTextEncoding, createHash } from 'crypto';
import { readFileSync } from 'fs';
import sharp, { Region } from 'sharp';
import { File } from 'src/entities/File';
import { FileProvider } from 'src/entities/FileProvider';
import { ImageQueryDto } from './dto/image-query.dto';
import { FilesystemService } from './filesystem/filesystem.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private configService: ConfigService,
    private readonly filesystemService: FilesystemService,
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
    @InjectRepository(FileProvider)
    private readonly fileProviderRepository: EntityRepository<FileProvider>,
  ) {}

  private defaultProvider: FileProvider;
  async getDefaultFileProvider() {
    if (!this.defaultProvider) {
      const fileProvider = await this.fileProviderRepository.findOne({ name: 'filesystem' });

      if (!fileProvider) {
        const newFileProvider = new FileProvider('filesystem');
        await this.fileProviderRepository.persistAndFlush(newFileProvider);
        this.defaultProvider = newFileProvider;
      } else {
        this.defaultProvider = fileProvider;
      }
    }

    return this.defaultProvider;
  }

  findOne(uuid: string) {
    return this.fileRepository.find(uuid);
  }

  generateHash(fullpath: string, algorith = 'sha256', encoding: BinaryToTextEncoding = 'base64') {
    const fileBuffer = readFileSync(fullpath);
    const hashSum = createHash(algorith);
    hashSum.update(fileBuffer);
    const hash = hashSum.digest(encoding);
    return hash;
  }

  async saveImage(fullpath: string, file: Express.Multer.File, region?: Region): Promise<File> {
    try {
      if (region) {
        await sharp(file.buffer).extract(region).toFile(fullpath);
      } else {
        await sharp(file.buffer).toFile(fullpath);
      }
    } catch (err) {
      this.logger.error(`${err}\tOn ${fullpath}\twith region ${JSON.stringify(region)}`);
      throw err;
    }

    const hash = this.generateHash(fullpath);
    const provider = await this.getDefaultFileProvider();
    const fileRecord = new File(provider, fullpath, hash);
    return fileRecord;
  }

  async getImage(uuid: string, imageQuery: ImageQueryDto) {
    const imageRecord = await this.fileRepository.findOne(uuid, ['provider']);

    let imageBuffer = null;
    if (imageRecord.provider.name === 'filesystem') {
      imageBuffer = await this.filesystemService.readImage(imageRecord.fullpath, imageQuery);
    }

    return imageBuffer;
  }
}
