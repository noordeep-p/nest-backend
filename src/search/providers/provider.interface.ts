import SearchModel from '../searchModel';
import Result from '../result';

export interface ProviderInterface {
  search(
    searchModel: SearchModel,
    offset: number,
    limit: number,
    user?: string,
  ): Promise<Result<any>>;

  length(searchModel: SearchModel, user?: string): Promise<number>;
}
