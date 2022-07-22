import Result from '../result';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class SearchResultResourceBuilder {
  private getters: { <T>(collection: Result<T>): any }[] = [];

  public records() {
    this.getters.push(<T>(result: Result<T>) => ['records', result.records]);
    return this;
  }

  public totalCount() {
    this.getters.push(<T>(result: Result<T>) => [
      'totalCount',
      result.totalCount,
    ]);
    return this;
  }

  public page() {
    this.getters.push(<T>(result: Result<T>) => [
      'page',
      Math.ceil(result.offset / result.limit) + 1,
    ]);
    return this;
  }

  public pageSize() {
    this.getters.push(<T>(result: Result<T>) => ['pageSize', result.limit]);
    return this;
  }

  public totalPages() {
    this.getters.push(<T>(result: Result<T>) => [
      'totalPages',
      Math.ceil(result.totalCount / result.limit),
    ]);
    return this;
  }

  public filterOptions() {
    this.getters.push(<T>(result: Result<T>) => [
      'filterOptions',
      result.filter_options,
    ]);
    return this;
  }

  public build<T>(result: Result<T>) {
    return this.getters
      .map((getter) => getter(result))
      .reduce((object, [key, value]) => {
        object[key] = value;
        return object;
      }, {});
  }
}
