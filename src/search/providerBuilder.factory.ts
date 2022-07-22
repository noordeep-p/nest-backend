import ArticleProvider from './providers/article.provider';
import CollectionProvider from './providers/collection.provider';
import WorkProvider from './providers/work.provider';
import { Injectable } from '@nestjs/common';
import ProviderBuilder from './provider.builder';

@Injectable()
export default class ProviderBuilderFactory {
  public constructor(
    private articleProvider: ArticleProvider,
    private collectionProvider: CollectionProvider,
    private workProvider: WorkProvider,
  ) {}

  public create() {
    return new ProviderBuilder(
      this.articleProvider,
      this.collectionProvider,
      this.workProvider,
    );
  }
}
