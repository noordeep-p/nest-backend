import { Injectable } from '@nestjs/common';
import SearchModel from '../searchModel';
import { ProviderInterface } from './provider.interface';
import fetch from 'node-fetch';
import Result from '../result';

@Injectable()
export default class ArticleProvider implements ProviderInterface {
  public async search(searchModel: SearchModel, offset: number, limit: number) {
    const response = await fetch('https://strapi.dev.curationist.org/features');

    const items = await response.json();

    function makePattern(values: string[]) {
      return function (value) {
        for (const pattern of values) {
          if (new RegExp(pattern, 'ig').test(value)) {
            return true;
          }
        }
        return false;
      };
    }

    const filter = makePattern(searchModel.query().getBasicSearch());

    const collections = items.filter((item) => filter(JSON.stringify(item)));

    return new Result(
      collections.slice(offset, offset + limit),
      offset,
      limit,
      collections.length,
      collections.length / limit,
      {},
    );
  }

  public async length(searchModel: SearchModel) {
    return (await this.search(searchModel, 1, 1)).totalCount;
  }
}
