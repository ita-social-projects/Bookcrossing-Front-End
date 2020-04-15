import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../../models/page';
import { PaginationParameters } from 'src/app/core/models/paginationParameters';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  constructor(private http: HttpClient) { }
  getPage<T>(getUrl: string, paginationParameters: PaginationParameters): Observable<IPage<T>> {
    let params = new HttpParams()
      .set("page", paginationParameters.page.toString())
      .set("pageSize", paginationParameters.pageSize.toString())
      .set("firstRequest", paginationParameters.firstRequest.toString())
    if (paginationParameters.searchQuery) {
      params = params.set("searchQuery", paginationParameters.searchQuery)
    }
    if (paginationParameters.searchField) {
      params = params.set("searchField", paginationParameters.searchField)
    } 
    if (paginationParameters.orderByField) 
    {
      params = params.set("orderByField", paginationParameters.orderByField)
    } 
    if (paginationParameters.orderByField) {
      params = params.set("orderByAscending", paginationParameters.orderByAscending.toString())
    }
    return this.http.get<IPage<T>>(getUrl, { params });
  }
}
