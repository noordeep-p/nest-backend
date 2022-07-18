import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import CreateCollectionDto from './dtos/CreateCollection.dto';
import Collection from './entities/collection.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
    private dataSource: DataSource,
  ) {}

  create(
    user: string,
    createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    const collection = new Collection();
    collection.ownerId = user;
    collection.title = createCollectionDto.title;
    collection.description = createCollectionDto.description;
    collection.isPrivate = createCollectionDto.isPrivate;
    return this.collectionsRepository.save(collection);
  }

  findAll(): Promise<Collection[]> {
    return this.collectionsRepository.find();
  }

  findOne(id: string): Promise<Collection> {
    return this.collectionsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.collectionsRepository.delete(id);
  }
}
