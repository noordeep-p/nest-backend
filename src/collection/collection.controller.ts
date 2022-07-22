import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CollectionService } from './collection.service';
import AddCollectionElementDto from './dtos/AddCollectionElement.dto';
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

  @Get(':id/elements')
  @UseGuards(AuthGuard('jwt'))
  public async getItems(@Req() request, @Param('id') collectionId: string) {
    const userId = request.user.sub;
    const page = request?.query?.page || 1;
    const pageSize = request?.query?.pageSize || 10;
    return await this.collectionService.getElements(
      userId,
      collectionId,
      page,
      pageSize,
    );
  }

  @Put(':id/elements')
  @UseGuards(AuthGuard('jwt'))
  public async addItem(
    @Req() request,
    @Param('id') collectionId: string,
    @Body() addElementDto: AddCollectionElementDto,
  ) {
    const userId = request.user.sub;
    return await this.collectionService.addElement(
      userId,
      collectionId,
      addElementDto,
    );
  }

  @Delete('elements/:id')
  @UseGuards(AuthGuard('jwt'))
  public async removeItem(
    @Req() request,
    @Param('id') collectionElementId: string,
  ) {
    const userId = request.user.sub;
    return await this.collectionService.removeElement(
      userId,
      collectionElementId,
    );
  }
}
