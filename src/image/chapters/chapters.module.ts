import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Chapter } from 'src/entities/Chapter';
import { Page } from 'src/entities/Page';
import { Story } from 'src/entities/Story';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';

@Module({
  imports: [MikroOrmModule.forFeature([Chapter, Story, Page])],
  controllers: [ChaptersController],
  providers: [ChaptersService],
})
export class ChaptersModule {}
