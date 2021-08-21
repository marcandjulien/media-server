import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export enum SharpFitType {
  /**
   * cover: (default) Preserving aspect ratio, ensure the image covers both provided
   * dimensions by cropping/clipping to fit.
   */
  COVER = 'cover',
  /**
   * contain: Preserving aspect ratio, contain within both provided dimensions using
   * "letterboxing" where necessary.
   */
  CONTAIN = 'contain',
  /**
   * fill: Ignore the aspect ratio of the input and stretch to both provided dimensions.
   */
  FILL = 'fill',
  /**
   * inside: Preserving aspect ratio, resize the image to be as large as possible while
   * ensuring its dimensions are less than or equal to both those specified.
   */
  INSIDE = 'inside',
  /**
   * outside: Preserving aspect ratio, resize the image to be as small as possible while
   * ensuring its dimensions are greater than or equal to both those specified.
   */
  OUTSIDE = 'outside',
}

export class ImageQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  width: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  height: number;

  @IsOptional()
  fit: SharpFitType;
}
