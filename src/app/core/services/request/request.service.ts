import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { requestUrl } from "src/app/configs/api-endpoint.constants";
import { IRequest } from 'src/app/core/models/request';
import { PaginationParameters } from 'src/app/core/models/Pagination/paginationParameters';
import { PaginationService } from '../pagination/pagination.service';
import { IPage } from '../../models/page';

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

  getAllRequestesByBookId(bookId: number, paginationParameters : PaginationParameters) :Observable<IPage<IRequest>>{
    return this.pagination.getPage<IRequest>(`${this.baseUrl}/${bookId}`, paginationParameters);
  }

  deleteRequest(requestId: number) {
    return this.http.delete<boolean>(this.baseUrl + `/${requestId}`);
  }

  approveRequest(requestId: number) {
    return this.http.put<boolean>(this.baseUrl + `/${requestId}`, {
      requestId: requestId,
    });
  }
}
