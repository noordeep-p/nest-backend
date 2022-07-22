import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import AddCollectionElementDto from './dtos/AddCollectionElement.dto';
import CreateCollectionDto from './dtos/CreateCollection.dto';
import UpdateCollectionDto from './dtos/UpdateCollection.dto';
import Collection from './entities/collection.entity';
import CollectionElement from './entities/collectionElement.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionElement)
    private collectionElementRepository: Repository<CollectionElement>,
    private dataSource: DataSource,
  ) {}

  public async findAll(): Promise<Collection[]> {
    return await this.collectionRepository.find();
  }

  public async findAllByUser(userId: string): Promise<Collection[]> {
    return await this.collectionRepository.findBy({
      ownerId: userId,
    });
  }

  public async findById(collectionId: string): Promise<Collection> {
    return await this.collectionRepository.findOneBy({
      id: collectionId,
    });
  }

  public async create(
    userId: string,
    createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    const collection = new Collection();
    collection.ownerId = userId;
    collection.title = createCollectionDto.title;
    collection.description = createCollectionDto.description;
    collection.isPrivate = createCollectionDto.isPrivate;
    return await this.collectionRepository.save(collection);
  }

  public async update(
    userId: string,
    collectionId: string,
    updateDto: UpdateCollectionDto,
  ): Promise<Collection> {
    const collection = await this.collectionRepository.findOneBy({
      id: collectionId,
    });
    if (collection.ownerId === userId) {
      if (updateDto.title) {
        collection.title = updateDto.title;
      }
      if (updateDto.description) {
        collection.description = updateDto.description;
      }
      if (typeof updateDto.isPrivate !== 'undefined') {
        collection.isPrivate = updateDto.isPrivate;
      }
      return await this.collectionRepository.save(collection);
    } else {
      throw new UnauthorizedException();
    }
  }

  public async delete(
    userId: string,
    collectionId: string,
  ): Promise<Collection> {
    const collection = await this.collectionRepository.findOneBy({
      id: collectionId,
    });
    if (collection.ownerId === userId) {
      return await this.collectionRepository.remove(collection);
    } else {
      throw new UnauthorizedException();
    }
  }

  public async getElements(
    userId: string,
    collectionId: string,
    page: number,
    pageSize: number,
  ): Promise<CollectionElement[]> {
    return await this.dataSource
      .getRepository(CollectionElement)
      .createQueryBuilder('collectionElement')
      .leftJoinAndSelect(
        'collectionElement.collection',
        'collection',
        'collection.id = :collectionId',
        { collectionId },
      )
      .where('collection.ownerId = :userId', { userId })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .select([
        'collectionElement.id',
        'collectionElement.value',
        'collectionElement.createdAt',
      ])
      .getMany();
  }

  public async addElement(
    userId: string,
    collectionId: string,
    addElementDto: AddCollectionElementDto,
  ): Promise<CollectionElement> {
    const collection = await this.collectionRepository.findOneBy({
      id: collectionId,
    });
    if (collection.ownerId === userId) {
      const collectionElement = new CollectionElement();
      collectionElement.value = addElementDto.value;
      collectionElement.collection = collection;
      return await this.collectionElementRepository.save(collectionElement);
    } else {
      throw new UnauthorizedException();
    }
  }

  public async removeElement(
    userId: string,
    collectionElementId: string,
  ): Promise<CollectionElement> {
    const collectionElement = await this.collectionElementRepository.findOne({
      where: {
        id: collectionElementId,
      },
      relations: {
        collection: true,
      },
    });

    if (collectionElement.collection.ownerId === userId) {
      return await this.collectionElementRepository.remove(collectionElement);
    } else {
      throw new UnauthorizedException();
    }
  }
}
