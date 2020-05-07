import { FilterParameters } from './Pagination/FilterParameters';
import { PageableParameters } from './Pagination/pageableParameters';
import { HttpParams } from '@angular/common/http';

export class BookQueryParams extends PageableParameters {

  showAvailable?: boolean;
  searchTerm?: string;
  location?: number;
  genres?: number[];
  static mapFromQuery(params: any, defaultPage: number = 1, defaultPageSize: number = 8): BookQueryParams {
    const book = new BookQueryParams();
    book.page = params.page ? +params.page : defaultPage;
    book.pageSize = params.pageSize ? +params.pageSize : defaultPageSize;
    book.location = params.location ? +params.location : undefined;
    book.searchTerm = params.searchTerm ? params.searchTerm : undefined;
    book.showAvailable = typeof params.showAvailable === 'undefined' ? undefined : JSON.parse(params.showAvailable);
    book.genres = params.genres ? params.genres : undefined;
    return book;
  }

  public getHttpParams(): HttpParams {
    let params = new HttpParams();
    params = this.mapPagination(params, this);
    if (this.searchTerm) {
      params = params.set('searchTerm', this.searchTerm);
    }
    if (this.location) {
      params = params.set('location', this.location.toString());
    }
    if (typeof this.showAvailable !== 'undefined') {
      params = params.set('showAvailable', this.showAvailable.toString());
    }
    if (this.genres?.length > 0) {
      for (const id of this.genres) {
        params = params.append('genres', id.toString());
      }
    }
    return params;
  }
  public getQueryObject(): object {
    return this;
  }
}
