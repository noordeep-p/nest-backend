export default class Result<T> {
  public constructor(
    private _records: T,
    private _offset: number,
    private _limit: number,
    private _totalCount: number,
    private _totalPages: number,
    private _filter_options: any,
  ) {}

  get records(): T {
    return this._records;
  }

  get offset(): number {
    return this._offset;
  }

  get limit(): number {
    return this._limit;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  get totalPages(): number {
    return this._totalPages;
  }

  get filter_options(): any {
    return this._filter_options;
  }
}
