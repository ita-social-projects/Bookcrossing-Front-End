import { PageableParameters } from './Pagination/pageableParameters';
import { HttpParams } from '@angular/common/http';

export class OuterBookQueryParams extends PageableParameters {

  searchTerm?: string;

  static mapFromQuery(params: any, defaultPage: number = 1, defaultPageSize: number = 8): OuterBookQueryParams {
    const book = new OuterBookQueryParams();
    book.page = params.page ? +params.page : defaultPage;
    book.pageSize = params.pageSize ? +params.pageSize : defaultPageSize;
    book.searchTerm=params.searchTerm;
    console.log(book);
    return book;
  }

  public getHttpParams(): HttpParams {
    let params = new HttpParams();
    params = this.mapPagination(params, this);
    if (this.searchTerm) {
      params = params.set('searchTerm', this.searchTerm);
    }
    return params;
  }

  public getQueryObject(): object {
    return this;
  }
}
