import { FilterParameters } from './FilterParameters';
import { SortParameters } from './SortParameters';
import { PageableParameters } from './pageableParameters';

export class PaginationParameters extends PageableParameters {
  filters : FilterParameters[];
  sort : SortParameters;
}
