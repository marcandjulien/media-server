import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Page } from 'src/entities/Page';
import { ChaptersModule } from './chapters/chapters.module';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { PagesModule } from './pages/pages.module';
import { StoriesModule } from './stories/stories.module';

@Module({
  imports: [MikroOrmModule.forFeature([Page]), StoriesModule, ChaptersModule, PagesModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
