import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import SearchDto from './dtos/search.dto';
import SearchService from './search.service';
import SearchModel from './searchModel';
import SearchResultResourceBuilder from './resources/searchResultResource.builder';
import { ProvidersEnum } from './providers/providers.enum';
import ProviderBuilderFactory from './providerBuilder.factory';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export default class SearchController {
  public constructor(
    private searchService: SearchService,
    private searchResultResourceBuilder: SearchResultResourceBuilder,
    private providerBuilderFactory: ProviderBuilderFactory,
  ) {}

  @Post('search')
  @UseGuards(AuthGuard(['jwt', 'unauthenticated']))
  public async search(@Body() searchDto: SearchDto, @Request() request) {
    const searchModel = new SearchModel();

    searchModel
      .query()
      .basicSearch(...(searchDto?.query?.basicsearch || []))
      .culturalContext(...(searchDto?.query?.culturalcontext || []))
      .description(...(searchDto?.query?.description || []))
      .material(...(searchDto?.query?.material || []))
      .provenance(...(searchDto?.query?.provenance || []))
      .subject(...(searchDto?.query?.subject || []))
      .source(...(searchDto?.query?.source || []))
      .stylePeriod(...(searchDto?.query?.styleperiod || []))
      .date(...(searchDto?.query?.date || []))
      .technique(...(searchDto?.query?.technique || []))
      .title(...(searchDto?.query?.title || []))
      .agent(...(searchDto?.query?.agent || []));
    searchModel
      .filter()
      .source(...(searchDto?.filters?.source || []))
      .workType(...(searchDto?.filters?.worktype || []));

    const providerBuilder = this.providerBuilderFactory.create();

    if (!searchDto.providers) {
      providerBuilder.works();
    }

    if (searchDto?.providers?.includes(ProvidersEnum.articles)) {
      providerBuilder.articles();
    }
    if (searchDto?.providers?.includes(ProvidersEnum.collections)) {
      providerBuilder.collections();
    }

    if (searchDto?.providers?.includes(ProvidersEnum.works)) {
      providerBuilder.works();
    }

    const result = await this.searchService.search(
      providerBuilder.build(),
      searchModel,
      (searchDto?.pagination?.page - 1) * searchDto?.pagination?.pageSize,
      searchDto?.pagination.pageSize,
      request?.user.sub,
    );

    return this.searchResultResourceBuilder
      .records()
      .page()
      .pageSize()
      .totalCount()
      .totalPages()
      .filterOptions()
      .build(result);
  }
}
