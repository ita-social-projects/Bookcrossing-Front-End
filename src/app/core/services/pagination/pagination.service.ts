import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../../models/page';
import { CompletePaginationParams } from 'src/app/core/models/Pagination/completePaginationParameters';
import { HttpParams, HttpClient } from '@angular/common/http';
import { PageableParameters } from '../../models/Pagination/pageableParameters';
import { BookQueryParams } from '../../models/bookQueryParams';
import { OuterBookQueryParams } from '../../models/outerBookQueryParams';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(private http: HttpClient) { }
  getPaginatedPage<T>(getUrl: string, paginationParameters: CompletePaginationParams): Observable<IPage<T>> {
    let params = new HttpParams();
    params = paginationParameters.getHttpParams();
    return this.http.get<IPage<T>>(getUrl, { params });
  }
  getBookPage<T>(getUrl: string, bookParams: BookQueryParams): Observable<IPage<T>> {
    let params = new HttpParams();
    params = bookParams.getHttpParams();
    return this.http.get<IPage<T>>(getUrl, { params });
  }
  getOuterBookPage<T>(getUrl: string, bookParams: OuterBookQueryParams): Observable<IPage<T>> {
    let params = new HttpParams();
    params = bookParams.getHttpParams();
    return this.http.get<IPage<T>>(getUrl, { params });
  }
  getPage<T>(getUrl: string, pagination: PageableParameters): Observable<IPage<T>> {
    let params = new HttpParams();
    params = pagination.mapPagination(params, pagination);
    return this.http.get<IPage<T>>(getUrl, { params });
  }

}
