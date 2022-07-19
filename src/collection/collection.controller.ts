import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CollectionService } from './collection.service';
import CreateCollectionDto from './dtos/CreateCollection.dto';
import UpdateCollectionDto from './dtos/UpdateCollection.dto';
import Collection from './entities/collection.entity';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<Collection[]> {
    return await this.collectionService.findAll();
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async findAllByUser(@Req() request): Promise<Collection[]> {
    const userId = request.user.sub;
    return await this.collectionService.findAllByUser(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id') collectionId: string): Promise<Collection> {
    return await this.collectionService.findById(collectionId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Req() request,
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    const userId = request.user.sub;
    return await this.collectionService.create(userId, createCollectionDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Req() request,
    @Param('id') collectionId: string,
    @Body() updateDto: UpdateCollectionDto,
  ) {
    const userId = request.user.sub;
    return await this.collectionService.update(userId, collectionId, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id') collectionId: string,
    @Req() request,
  ): Promise<any> {
    const userId = request.user.sub;
    return await this.collectionService.delete(userId, collectionId);
  }
}
