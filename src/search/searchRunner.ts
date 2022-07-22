import { Injectable } from '@nestjs/common';
import SearchModel from './searchModel';
import { query } from './search';
import { Client } from '@opensearch-project/opensearch';
import Result from './result';

@Injectable()
export default class SearchRunner {
  private static INDEX_NAME = 'works';

  public constructor(private client: Client) {}

  public async search(
    searchModel: SearchModel,
    offset: number,
    limit: number,
    source: false | string[] = [],
  ) {
    const body = {
      ...query(SearchRunner.INDEX_NAME, searchModel.getQuery()),
      ...searchModel.aggregationForFilterItems(),
      _source: source,
      from: offset,
      size: limit,
    };
    console.log(JSON.stringify(body, null, 2));
    const response = await this.client.search({ body });
    let records = response?.body?.hits?.hits || [];
    const totalCount = response?.body?.hits?.total?.value || 0;
    const filter_options =
      response?.body?.aggregations?.filter_options?.value || [];

    if (source !== false && source.length) {
      records = records.map((record) => {
        if (!record._source.media.length) {
          record._source.media.push({
            value:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAADFCAMAAACM/tznAAAAM1BMVEXw8PK6vsHN0NO3u77u7/HN0NK7v8LMz9LZ293JzM/r7O7i4+XGyczT1tjDxsnR09bk5efCgtKkAAAFJklEQVR4nO2d7XaCMAyGrYBAQeT+r3aAiihfTUjakuX9tbPNQ96nSai01stFpVKpVCqVSqVSqVQqlUqlWpOt7vfH43G/VzZ0KP5lizyZqiz+EwRblLfEfCu5/RsGtmh+3b8Z3P8DgmI2+FMERejwuNWW6/YHBGUbOkRWVRvD/06CKnSQjMpuO/Z73fLQYXIpve4N/ysJstCRMsnRf0dAZg44+xdKoHD33xG4hw6XXK1L//voJu5uCPPfERA2KbxDCqCXsCJoof47AqKKoAT7N6YOHTShWoR/YwTNiTEJICkFLPQW8JScGwFoDvSRnBtBjvJvTBk6cCKlSP8mEVIDFRqAkAdk4FngCOAROnQaYVsAexOwnkoM7d8Y1rhsXaasF3gLWwFdDXAGaOskybzkwAEAjPGl/fJMkvnIgTgBPJenvORAjAC6/H9dwkMORAhg9O+FQHxNMK0nMfETiA5A+r08zU4gtolQ+rs8n+S8BB7oqTDLGpmtZ/EwE0A+DmB6IGCXFuh5q8Ai/bPcBNL5+A+XenASqJEAGvpQZvU/EuDMAeT7YYZ3w6v+eQlgH4qSL40s9L8JgSsfgQYFgLwC0u0NSox9oMLUAPkDsZX+54UAJgWoE2Cj/kcCbH0AkQLUCbA7/rwE4ItjNW0oO/U/EuDqhBa8P4B2EuTon7EPAOfDxAXglP/MBECzIeI5EMA/Xx/YnIT8xtCQFgDIPyOB/dvQW8T+Xev/Q4Dy8h85E6D1f4H65+sDDlOR/uoN6dWB+c9L4FI4XLygvTbGPyeBnSSg/swIuP5HcRGw209H6kDzn7n41uar1aRMauqdcXj/rFuU2mzhkzPJLSd/AIKr/zEixueEtsqbJHmH1/3UlAwfHz3mn/tJqW2rom561UXVcjz/PZL/L7ESYFaaH/d/6l1KBONvzrxZ82j9jwTOWQUU9X9mAiT1P+p8fSDNKP13feBsOUCX/28CoR3BRO3/ZDlA2P8mOhEB0v436jxVQNv/zkeAJf9PRIDP/yk6Ie38Z67Yc4B4/jNX7FXAPP7RE+Cs/zMQ8OE/4k7IXv+jIs0Bb/69VAH88Th///NJoABvD/Hpn78PFGDIfv0b5veGwwIyJAf89T8vBF4L6AACgBOqyMTXB8bNZM4EvOf/iwBPDkw20zkSCJD/jAS+N5C4EAgz/oMYCPyctOCQA6HGfxB5H5idNLFLIKh/8k64sJl2h0DA/HcJD6jFHfWblwjtn3ZD5dpJK+sEwuZ/L8rdA6snzazmAPrzqHQiBLBx0s4KgfDjTwlgcwPpIoEQ89+ZyADsnLS0QCAK/2QA9k+a+iUQQ/4bMgAOJ2395EAE/W8QDQCnk8a+CEQy/kQAHE9amxCIxj8JAPeT5t4E4uh/gwgAQE7aexKIpf57HQcAOmlwqIKY/B8HADxpsSMQT/33OgoAftIk7iAGNh0EgD5pMxodA1BFNpwIHQJw/vE/BkCC/yMARPg/AECGfzwAAf1vEBaAkPFHA5Ay/lgAYsYfCUDO+OMASPKPASAo/w0GgKjxRwDAfdtOvIICAH7fWvwCAhCW/wYKQJ5/GACB/kEAxNV/LwAAkf4BACTmvwEAEOrfGYBU/84AQsfJJkcAaVTLWZRSAApAASgABaAAFIACUAAKQAEoAAWgABSAAlAACkABKAAFoAAUgAJQAArAHcAenKj/7niERppfB2XXUZMfF3+Zbf9y70XL/7r4qr3Xb/49p/5aWJVKpVKpVCqVSqVSqVQqlep8+gND22vRi1NxnAAAAABJRU5ErkJggg==',
            position: 1,
            type: {
              value: 'image',
            },
            encodingFormat: {
              value: 'image/jpeg',
            },
            dateCreated: 'default',
          });
        }
        return record;
      });
    }

    return new Result(
      records,
      offset,
      limit,
      totalCount,
      Math.ceil(totalCount / limit),
      filter_options,
    );
  }

  public async count(searchModel: SearchModel) {
    const response = await this.client.count({
      body: {
        ...query(SearchRunner.INDEX_NAME, searchModel.getQuery()),
      },
    });
    return response?.body?.count || 0;
  }
}
