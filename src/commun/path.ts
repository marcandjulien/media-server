import { isString } from 'lodash';
import path from 'path';

export const createPath = (...parts: string[]) =>
  path.join(...parts.filter((part) => isString(part)));

export const createFilename = (filename: string, extension: string) =>
  [filename, extension].join('.');
