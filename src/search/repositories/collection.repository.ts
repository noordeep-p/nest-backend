import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import Collection from '../../collection/entities/collection.entity';

@Injectable()
export default class CollectionRepository extends Repository<Collection> {
  constructor(private dataSource: DataSource) {
    super(Collection, new EntityManager(dataSource));
  }

  public async findByUserAndTitle(userId: string, title: string) {
    return this.findOne({
      where: { ownerId: userId, title },
      relations: {
        elements: true,
      },
    });
  }

  public async findCollections(offset: number, limit: number, userId?: string) {
    const qb = this.dataSource
      .getRepository(Collection)
      .createQueryBuilder('collection');

    qb.leftJoinAndSelect('collection.elements', 'element');

    if (userId) {
      qb.where('("ownerId" = :id or collection.isPrivate = :isPrivate)', {
        id: userId,
        isPrivate: false,
      });
      qb.orderBy('updatedAt', 'DESC');
    } else {
      qb.where('(collection.isPrivate = :isPrivate)', {
        isPrivate: false,
      });
    }

    qb.addOrderBy('collection.isPrivate', 'DESC')
      .addOrderBy('collection.title', 'ASC')
      .offset(offset)
      .limit(limit);

    return qb.getMany();
  }

  public async findById(id: string) {
    return this.findOne({
      where: { id },
      relations: {
        elements: true,
      },
    });
  }

  public async findByIdAndUser(id: string, userId?: string) {
    if (userId) {
      return this.findOne({
        where: { id, ownerId: userId },
        relations: {
          elements: true,
        },
      });
    }
    return this.findOne({
      where: { id, isPrivate: false },
      relations: {
        elements: true,
      },
    });
  }

  public async findCollectionsByWorkIds(
    ids: string[],
    offset: number,
    limit: number,
    userId?: string,
  ) {
    return (await this.prepareCollectionsByWorkIds(ids, userId))
      .take(limit)
      .skip(offset)
      .getMany();
  }

  public async countCollectionsByWorkIds(ids: string[], userId?: string) {
    return (await this.prepareCollectionsByWorkIds(ids, userId)).getCount();
  }

  private async prepareCollectionsByWorkIds(ids: string[], userId?: string) {
    const qb = this.dataSource
      .getRepository(Collection)
      .createQueryBuilder('collection');

    qb.distinct()
      .innerJoinAndSelect('collection.elements', 'element')
      .where('element.value in (:...ids)', { ids })
      .groupBy('collection.id, element.id')
      .orderBy('collection.id');
    if (userId) {
      qb.andWhere('("ownerId" = :id or collection.isPrivate = :isPrivate)', {
        id: userId,
        isPrivate: false,
      });
    } else {
      qb.andWhere('(collection.isPrivate = :isPrivate)', {
        isPrivate: false,
      });
    }
    return qb;
  }
}
