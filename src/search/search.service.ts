import SearchModel from './searchModel';
import { Injectable } from '@nestjs/common';
import { ProviderInterface } from './providers/provider.interface';
import Result from './result';

@Injectable()
export default class SearchService {
  public async search(
    providers: ProviderInterface[],
    searchModel: SearchModel,
    offset: number,
    limit: number,
    user?: string,
  ) {
    const limitCopy = limit;
    const offsetCopy = offset;

    const results = [];
    let totalCount = 0;
    const filter_options = {};
    for (const collection of providers) {
      const collectionLength = await collection.length(searchModel, user);
      totalCount += collectionLength;
      if (offset >= collectionLength) {
        offset -= collectionLength;
      } else {
        const collectionLimit = Math.min(collectionLength - offset, limit);
        limit -= collectionLimit;
        const search_response = await collection.search(
          searchModel,
          offset,
          collectionLimit,
          user,
        );
        results.push(...search_response.records);
        Object.assign(filter_options, search_response.filter_options);
        offset = 0;
      }
    }
    return new Result(
      results,
      offsetCopy,
      limitCopy,
      totalCount,
      Math.ceil(totalCount / limitCopy),
      filter_options,
    );
  }
}
