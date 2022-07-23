import { Module } from '@nestjs/common';
import SearchController from './search.controller';
import SearchService from './search.service';
import { Client } from '@opensearch-project/opensearch';
import SearchResultResourceBuilder from './resources/searchResultResource.builder';
import ProviderBuilderFactory from './providerBuilder.factory';
import ArticleProvider from './providers/article.provider';
import CollectionProvider from './providers/collection.provider';
import WorkProvider from './providers/work.provider';
import SearchRunner from './searchRunner';
import CollectionRepository from './repositories/collection.repository';

@Module({
  controllers: [SearchController],
  providers: [
    {
      useFactory: () => {
        return new Client({
          node: process.env.OPENSEARCH_HOST,
          auth: {
            username: process.env.OPENSEARCH_USER,
            password: process.env.OPENSEARCH_PASSWORD,
          },
        });
      },
      provide: Client,
    },
    SearchService,
    SearchRunner,
    SearchResultResourceBuilder,
    ProviderBuilderFactory,
    ArticleProvider,
    CollectionProvider,
    WorkProvider,
    CollectionRepository,
  ],
})
export class SearchModule {}
