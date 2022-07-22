import { ProvidersEnum } from '../providers/providers.enum';

export default class SearchDto {
  public pagination?: {
    page?: number;
    pageSize?: number;
  };
  public query?: {
    date: any[];
    subject: any[];
    basicsearch?: string[];
    culturalcontext?: string[];
    description?: string[];
    material?: string[];
    provenance?: string[];
    source?: string[];
    styleperiod?: string[];
    technique?: string[];
    title?: string[];
    agent?: string[];
  };
  public filters?: {
    source?: string[];
    worktype?: string[];
  };
  public providers: ProvidersEnum[];
}
