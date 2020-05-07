import { FilterParameters } from './Pagination/FilterParameters';
import { SortParameters } from './Pagination/SortParameters';
import { PageableParameters } from './Pagination/pageableParameters';
import { HttpParams } from '@angular/common/http';

export class CompletePaginationParams extends PageableParameters {

  filters: FilterParameters[];
  sort: SortParameters;

  public getHttpParams(): HttpParams {
    let params = new HttpParams();
    params = this.mapPagination(params, this)
    if (this.filters) {
      params = FilterParameters.mapFilter(params, this.filters,'Filters');
    }
    if (this.sort) {
      params = this.sort.mapSort(params);
    }
    return params;
  }
  public mapFromQuery(params: any, defaultPage: number = 1, defaultPageSize: number = 10): CompletePaginationParams {
    let p = new CompletePaginationParams();
    p.sort = new SortParameters();
    p.page = params.page ? +params.page : defaultPage;
    p.pageSize = params.pageSize ? +params.pageSize : defaultPageSize;
    p.sort = SortParameters.mapFromQuery(params);
    p.filters = FilterParameters.mapFilterFromQuery(params, 'Filters');
    return p;
  }
  public getQueryObject(): object {
    let result = {};
    result = this.mapPaginationToQuery(result, this);
    if (this.sort) {
      result = SortParameters.mapToQueryObject(result, this.sort);
    }
    if (this.filters) {
      result = FilterParameters.mapFilterToQuery(result, this.filters, 'Filters');
    }
    return result;
  }

}
