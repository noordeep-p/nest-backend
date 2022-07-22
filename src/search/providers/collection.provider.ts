import { Injectable } from '@nestjs/common';
import Result from '../result';
import SearchModel from '../searchModel';
import WorkProvider from './work.provider';
import SearchRunner from '../searchRunner';
import { ProviderInterface } from './provider.interface';
import { Repository } from 'typeorm';
import Collection from 'src/collection/entities/collection.entity';

@Injectable()
export default class CollectionProvider implements ProviderInterface {
  private static MAX_BLOCK_SIZE = 1000;

  public constructor(
    private collectionRepository: Repository<Collection>,
    private workProvider: WorkProvider,
    private searchRunner: SearchRunner,
  ) {}

  public async search(
    searchModel: SearchModel,
    offset: number,
    limit: number,
    user?: string,
  ) {
    const offsetCopy = offset;
    const limitCopy = limit;

    const ids = await this.fetchIdentifiers(searchModel);
    let collections = [];
    let totalCount = 0;

    if (ids) {
      collections = await this.collectionRepository.findCollectionsByWorkIds(
        ids,
        offset,
        limit,
        user,
      );
      totalCount = await this.length(searchModel, user);
    }

    return new Result(
      collections,
      offsetCopy,
      limitCopy,
      totalCount,
      Math.ceil(totalCount / limit),
      {},
    );
  }

  public async length(searchModel: SearchModel, user?: string) {
    const ids = await this.fetchIdentifiers(searchModel);
    return this.collectionRepository.countCollectionsByWorkIds(ids, user);
  }

  public async fetchIdentifiers(searchModel: SearchModel) {
    const ids = [];
    let offset = 0;
    const limit = CollectionProvider.MAX_BLOCK_SIZE;
    let totalCount = 0;
    do {
      const result = await this.searchRunner.search(
        searchModel,
        offset,
        limit,
        false,
      );
      offset += limit;
      ids.push(...result.records.map((record) => record._id));
      totalCount = result.totalCount;
    } while (offset < totalCount);
    return ids;
  }
}
