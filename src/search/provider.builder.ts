import WorkProvider from './providers/work.provider';
import ArticleProvider from './providers/article.provider';
import CollectionProvider from './providers/collection.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class ProviderBuilder {
  private providers = [];

  public constructor(
    private articleProvider: ArticleProvider,
    private collectionProvider: CollectionProvider,
    private workProvider: WorkProvider,
  ) {}

  public articles() {
    this.providers.push(this.articleProvider);
    return this;
  }

  public collections() {
    this.providers.push(this.collectionProvider);
    return this;
  }

  public works() {
    this.providers.push(this.workProvider);
    return this;
  }

  public build() {
    return this.providers;
  }
}
