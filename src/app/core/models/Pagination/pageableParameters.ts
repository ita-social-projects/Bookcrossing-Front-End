import { HttpParams } from '@angular/common/http';

export class PageableParameters {  
  page: number = 1;
  pageSize: number = 10;
  firstRequest?: boolean = true;

  public mapPaginationToQuery(queryParams: any, pagination: PageableParameters): any {
    queryParams.page = pagination.page;
    queryParams.pageSize = pagination.pageSize;
    queryParams.firstRequest = pagination.firstRequest;
    return queryParams;    
  }  
  public mapPagination(params: HttpParams, parameters: PageableParameters): HttpParams {
    return params.set("page", parameters.page.toString())
      .set("pageSize", parameters.pageSize.toString())
      .set("firstRequest", parameters.firstRequest.toString())
  }
}