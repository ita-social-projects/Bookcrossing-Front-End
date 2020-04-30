import { RequestQueryParams } from './../../models/requestQueryParams';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { requestUrl } from "src/app/configs/api-endpoint.constants";
import { IRequest } from 'src/app/core/models/request';
import { PaginationParameters } from 'src/app/core/models/Pagination/paginationParameters';
import { PaginationService } from '../pagination/pagination.service';
import { IPage } from '../../models/page';
import { BookParameters } from '../../models/Pagination/bookParameters';

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

  getRequestForBook(bookId: number, param?: RequestQueryParams) :Observable<IRequest>{
    var params = new HttpParams();
    if(param.first){
      params = new HttpParams()
    .set("first", "true");
    }
    else if(param.last){
      params = new HttpParams()
    .set("first", "true");
    }
    
    return this.http.get<IRequest>(this.baseUrl + `/${bookId}`, { params } );
  }

  getUserRequestsPage(bookParams : BookParameters): Observable<IPage<IRequest>> {
    return this.pagination.getPageBooks<IRequest>(`${this.baseUrl}/`,bookParams);
  }

  deleteRequest(requestId: number) :Observable<boolean>{
    return this.http.delete<boolean>(this.baseUrl + `/${requestId}`);
  }

  approveReceive(requestId: number) :Observable<boolean>{
    return this.http.put<boolean>(this.baseUrl + `/${requestId}`, {
      requestId: requestId,
    });
  }
}
