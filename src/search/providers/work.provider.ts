import { Injectable } from '@nestjs/common';
import SearchRunner from '../searchRunner';
import SearchModel from '../searchModel';
import { ProviderInterface } from './provider.interface';

@Injectable()
export default class WorkProvider implements ProviderInterface {
  public constructor(private searchRunner: SearchRunner) {}

  public async search(
    searchModel: SearchModel,
    offset: number,
    limit: number,
    user?: string,
  ) {
    return this.searchRunner.search(searchModel, offset, limit);
  }

  public async length(searchModel) {
    return this.searchRunner.count(searchModel);
  }
}
