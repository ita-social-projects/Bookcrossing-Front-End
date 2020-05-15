import { RequestQueryParams } from './../../models/requestQueryParams';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { requestUrl } from "src/app/configs/api-endpoint.constants";
import { IRequest } from 'src/app/core/models/request';
import { PaginationService } from '../pagination/pagination.service';
import { IPage } from '../../models/page';
import { BookQueryParams } from '../../models/bookQueryParams';

@Injectable()
export class RequestService {
  constructor(
    private http: HttpClient,
    private pagination: PaginationService
  ) {}

  readonly baseUrl = requestUrl;

  requestBook(bookId: number) {
    return this.http.post<IRequest>(this.baseUrl + `/${bookId}`, {
      bookId: bookId,
    });
  }

  getRequestForBook(bookId: number, param?: RequestQueryParams): Observable<IRequest>{
    var params = new HttpParams();
    if(param.first === true){
      params = new HttpParams()
    .set("first", "true");
    }
    else if(param.last === true){
      params = new HttpParams()
    .set("last", "true");
    }
    return this.http.get<IRequest>(this.baseUrl + `/${bookId}`, { params } );
  }

  getUserRequestsPage(bookParams : BookQueryParams): Observable<IPage<IRequest>> {
    return this.pagination.getBookPage<IRequest>(`${this.baseUrl}/`,bookParams);
  }

  deleteRequest(requestId: number){
    return this.http.delete(this.baseUrl + `/${requestId}`);
  }

  approveReceive(requestId: number){
    return this.http.put(this.baseUrl + `/${requestId}`, {
      requestId: requestId,
    });
  }
}
