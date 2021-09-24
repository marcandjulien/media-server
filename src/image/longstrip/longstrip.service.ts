import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp, { Region } from 'sharp';
import { ColorType } from 'src/commun/color';
import { sum } from 'src/commun/math';

@Injectable()
export class LongstripService {
  private readonly logger = new Logger(LongstripService.name);

  constructor(private configService: ConfigService) {}

  async process(file: Express.Multer.File): Promise<Region[]> {
    const { rawPixelArray, height, width } = await this.getRawPixelArray(file);
    const linesColors = this.categorizeLinesColors(rawPixelArray, height, width);
    const groupOfLinesColors = this.groupLinesColors(linesColors);
    const cropsSelection = this.createCropSelection(groupOfLinesColors);
    return cropsSelection.map((crop) => ({ ...crop, left: 0, width }));
    // const pages = [];
    // cropSelection.forEach((val, ind) => {
    //   const page = new Page(String(ind + 1));
    //   page.path = `files/${page.uuid}.png`;
    //   pages.push(page);
    //   sharp(file.buffer)
    //     .extract({
    //       left: 0,
    //       top: val.top,
    //       width: width,
    //       height: val.height,
    //     })
    //     .toFile(page.path, function (err) {
    //       // Extract a region of the input image, saving in the same format.
    //     });
    // });
  }

  async getRawPixelArray(file: Express.Multer.File) {
    const {
      data,
      info: { height, width },
    } = await sharp(file.buffer).raw().toBuffer({ resolveWithObject: true });

    const rawPixelArray = new Uint8ClampedArray(data.buffer);

    return {
      rawPixelArray,
      height,
      width,
    };
  }

  categorizeLinesColors(rawPixel: Uint8ClampedArray, height, width): number[] {
    const trimThreshold = this.configService.get<number>('trimThreshold');
    const rgbSumWhite = this.configService.get<number>('rgbSumWhite');
    const rgbSumBlack = this.configService.get<number>('rgbSumBlack');

    const rgbPixelWidth = width * 3;

    const linesColors = new Array(height);
    for (let line = 0; line < height; line++) {
      const rgbPixelLine = rawPixel.slice(
        line * rgbPixelWidth,
        line * rgbPixelWidth + rgbPixelWidth,
      );
      const colorAverage = sum(rgbPixelLine) / width;
      if (colorAverage > rgbSumWhite - trimThreshold) {
        linesColors[line] = ColorType.WHITE;
      } else if (colorAverage < rgbSumBlack + trimThreshold) {
        linesColors[line] = ColorType.BLACK;
      } else {
        linesColors[line] = ColorType.MIXED;
      }
    }

    return linesColors;
  }

  groupLinesColors(linesColors: number[]) {
    return linesColors.reduce((acc, val, ind, arr) => {
      if (val !== arr[ind - 1]) {
        acc.push([]);
      }
      acc[acc.length - 1].push(val);
      return acc;
    }, []);
  }

  createCropSelection(groupOfLinesColors) {
    const cropSelection = [];

    groupOfLinesColors.forEach((val, ind, arr) => {
      let top = arr
        .slice(0, ind)
        .map((v) => v.length)
        .reduce((a, b) => a + b, 0);
      let height = val.length;
      const isFiller = val[0] >= 0;

      if (ind === 0) {
        // Code for first part of image
        if (isFiller && height > 100) {
          top = height - 100;
          height = 100;
        }
        cropSelection.push({ top, height });
        return;
      }

      if (ind === arr.length - 1) {
        // Code for last part of image
        if (isFiller && height > 100) {
          height = 100;
        }
        cropSelection[cropSelection.length - 1].height += height;
        return;
      }

      if (isFiller && height > 100) {
        // Code for clipping large filler
        if (height > 200) {
          top += height - 100;
          height = 100;
        } else {
          height = Math.round(height / 2);
          top += height - 1;
        }
        cropSelection[cropSelection.length - 1].height += height;
        cropSelection.push({ top, height });
        return;
      } else {
        cropSelection[cropSelection.length - 1].height += height;
        return;
      }
    });

    return cropSelection;
  }
}
