import { HttpParams } from '@angular/common/http';

export class SortParameters {
  orderByField?: string;
  orderByAscending = true;

  static mapFromQuery(query: any): any {
    const sort: SortParameters = new SortParameters();
    sort.orderByField = query['Sort.OrderByField'] ? query['Sort.OrderByField'] : null;
    sort.orderByAscending = query['Sort.OrderByAscending'] ? query['Sort.OrderByAscending'] : true;
    return sort;
  }
  static mapToQueryObject(queryParams: any, sort: SortParameters): any {
    if (sort.orderByField) {
      queryParams['Sort.OrderByField'] = sort.orderByField;
      queryParams['Sort.OrderByAscending'] = sort.orderByAscending;
    }
    return queryParams;
  }


  public mapSort(params: HttpParams): HttpParams {
    if (this.orderByField) {
      params = params.set('Sort.OrderByField', this.orderByField)
        .set('Sort.OrderByAscending', this.orderByAscending.toString());
    }
    return params;
  }
}
