import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Chapter } from 'src/entities/Chapter';
import { File } from 'src/entities/File';
import { FileProvider } from 'src/entities/FileProvider';
import { Page } from 'src/entities/Page';
import { Story } from 'src/entities/Story';
import { Tag } from 'src/entities/Tag';
import { FilesModule } from 'src/files/files.module';
import { LongstripService } from '../longstrip/longstrip.service';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Page, Chapter, Story, Tag, File, FileProvider]),
    FilesModule,
  ],
  controllers: [PagesController],
  providers: [PagesService, LongstripService],
})
export class PagesModule {}
