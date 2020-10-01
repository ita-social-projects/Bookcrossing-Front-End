import { HttpParams } from '@angular/common/http';

export class PageableParameters {
  page = 1;
  pageSize = 10;
  firstRequest = true;

  public mapPaginationToQuery(queryParams: any, pagination: PageableParameters): any {
    queryParams.page = pagination.page;
    queryParams.pageSize = pagination.pageSize;
    queryParams.firstRequest = pagination.firstRequest;
    return queryParams;
  }
  public mapPagination(params: HttpParams, parameters: PageableParameters): HttpParams {
    return params.set('page', parameters.page.toString())
      .set('pageSize', parameters.pageSize.toString())
      .set('firstRequest', parameters.firstRequest.toString());
  }
}
