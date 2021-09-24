import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ImageQueryParam } from '../dto/image-query-param.dto';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoriesService } from './stories.service';

@Controller('image/stories')
export class StoriesController {
  private readonly logger = new Logger(StoriesController.name);

  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  async create(@Body() createStoryDto: CreateStoryDto) {
    return await this.storiesService.create(createStoryDto);
  }

  @Get()
  findAll(@Query() query: ImageQueryParam) {
    return this.storiesService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string, @Query() query: ImageQueryParam) {
    return this.storiesService.findOne(uuid, query);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateStoryDto: UpdateStoryDto) {
    return this.storiesService.update(uuid, updateStoryDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  async remove(@Param('uuid') uuid: string) {
    await this.storiesService.remove(uuid);
  }
}
