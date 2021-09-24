import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { File } from 'src/entities/File';
import { FileProvider } from 'src/entities/FileProvider';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FilesystemModule } from './filesystem/filesystem.module';
import { FilesystemService } from './filesystem/filesystem.service';

@Module({
  imports: [MikroOrmModule.forFeature([File, FileProvider]), FilesystemModule],
  controllers: [FilesController],
  providers: [FilesService, FilesystemService],
  exports: [FilesService],
})
export class FilesModule {}
