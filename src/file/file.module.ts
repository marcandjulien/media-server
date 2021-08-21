import { Module } from '@nestjs/common';
import { FilesystemService } from './filesystem/filesystem.service';

@Module({ providers: [FilesystemService] })
export class FileModule {}
