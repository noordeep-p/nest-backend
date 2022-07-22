import { Module } from '@nestjs/common';
import SearchController from './search.controller';
import SearchService from './search.service';
import { Client } from '@opensearch-project/opensearch';

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
  ],
})
export class SearchModule {}
