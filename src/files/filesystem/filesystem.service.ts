import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ImageQueryDto, SharpFitType } from 'src/image/pages/dto/image-query.dto';

@Injectable()
export class FilesystemService {
  async writeImage(file: any, path) {
    console.log('Not implemented');
  }

  async readImage(fullpath: string, imageQuery: ImageQueryDto) {
    const promise = sharp(fullpath);
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
