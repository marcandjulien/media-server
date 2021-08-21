import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoriesService } from './stories.service';

@Controller('image/stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  create(@Body() createStoryDto: CreateStoryDto) {
    return this.storiesService.create(createStoryDto);
  }

  @Get()
  findAll() {
    return this.storiesService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.storiesService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateStoryDto: UpdateStoryDto) {
    return this.storiesService.update(uuid, updateStoryDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.storiesService.remove(uuid);
  }
}
