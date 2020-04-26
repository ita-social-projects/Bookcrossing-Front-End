import { FilterParameters } from './FilterParameters';
import { SortParameters } from './SortParameters';

export class PaginationParameters {
  page: number = 1;
  pageSize: number = 10;
  firstRequest?: boolean = true;
  filters : FilterParameters[];
  sort : SortParameters;
}
