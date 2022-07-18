import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CollectionService } from './collection.service';
import CreateCollectionDto from './dtos/CreateCollection.dto';
import Collection from './entities/collection.entity';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Req() request,
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    return this.collectionService.create(request.user, createCollectionDto);
  }

  @Get()
  findAll(): Promise<Collection[]> {
    return this.collectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Collection> {
    return this.collectionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.collectionService.remove(id);
  }
}
