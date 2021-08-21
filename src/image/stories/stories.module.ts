import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { MediaType } from 'src/entities/MediaType';
import { Page } from 'src/entities/Page';
import { Story } from 'src/entities/Story';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';

@Module({
  imports: [MikroOrmModule.forFeature([MediaType, Story, Page])],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}
