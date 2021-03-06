import { PageableParameters } from './Pagination/pageableParameters';
import { HttpParams } from '@angular/common/http';
import { bookState } from './bookState.enum';
import { element } from 'protractor';
import { state } from '@angular/animations';

export class BookQueryParams extends PageableParameters {
  showAvailable?: boolean;
  bookStates?: bookState[];
  searchTerm?: string;
  locations?: number[];
  homeLocations?: number[];
  locationFilterOn?: boolean;
  genres?: number[];
  languages?: number[];
  orderByField?: string;
  orderByAscending?: boolean;
  static mapFromQuery(
    params: any,
    defaultPage: number = 1,
    defaultPageSize: number = 8
  ): BookQueryParams {
    const book = new BookQueryParams();
    book.locationFilterOn =
      typeof params.locationFilterOn === 'undefined'
        ? undefined
        : JSON.parse(params.locationFilterOn);
    book.page = params.page ? +params.page : defaultPage;
    book.pageSize = params.pageSize ? +params.pageSize : defaultPageSize;
    book.locations = params.locations ? params.locations : undefined;
    book.homeLocations = params.homeLocations ? params.homeLocations : undefined;
    book.searchTerm = params.searchTerm ? params.searchTerm : undefined;
    book.bookStates = params.bookStates ? params.bookStates : undefined;
    book.genres = params.genres ? params.genres : undefined;
    book.languages = params.languages ? params.languages : undefined;
    book.orderByField = params.orderByField ? params.orderByField : undefined;
    book.orderByAscending =
      typeof params.orderByAscending === 'undefined'
        ? undefined
        : JSON.parse(params.orderByAscending);
    return book;
  }

  public getHttpParams(): HttpParams {
    let params = new HttpParams();
    params = this.mapPagination(params, this);
    if (this.locationFilterOn) {
      params = params.set('locationFilterOn', this.locationFilterOn.toString());
    }
    if (this.searchTerm) {
      params = params.set('searchTerm', this.searchTerm);
    }
    if (this.locations?.length > 0) {
      for (const id of this.locations) {
        params = params.append('locations', id.toString());
      }
    }
    if (this.homeLocations?.length > 0) {
      for (const id of this.homeLocations) {
        params = params.append('homeLocations', id.toString());
      }
    }
    if (this.bookStates?.length > 0) {
      for (const stateEl of this.bookStates) {
        params = params.append('bookStates', stateEl.toString());
      }
    }
    if (this.genres?.length > 0) {
      for (const id of this.genres) {
        params = params.append('genres', id.toString());
      }
    }
    if (this.languages?.length > 0) {
      for (const id of this.languages) {
        params = params.append('languages', id.toString());
      }
    }
    if (this.orderByField) {
      params = params.set('SortableParams.OrderByField', this.orderByField);
      if (typeof this.orderByAscending !== 'undefined') {
        params = params.set(
          'SortableParams.orderByAscending',
          this.orderByAscending.toString()
        );
      }
    }

    return params;
  }
  public getQueryObject(): object {
    return this;
  }
}
