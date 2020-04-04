import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { requestUrl } from "src/app/configs/api-endpoint.constants";
import { IRequest } from 'src/app/core/models/request';

@Injectable()
export class RequestService {
  constructor(
    private http: HttpClient,
  ) {}

  readonly baseUrl = requestUrl;

  requestBook(bookId: number) {
    this.http.post<IRequest>(this.baseUrl + `/${bookId}`, {
      bookId: bookId,
    });
  }

  getAllRequestesByBookId(bookId: number) {
    return this.http.get<IRequest[]>(this.baseUrl + `/${bookId}`);
  }

  deleteRequest(requestId: number) {
    return this.http.delete<IRequest>(this.baseUrl + `/${requestId}`);
  }

  approveRequest(requestId: number) {
    return this.http.put<IRequest>(this.baseUrl + `/${requestId}`, {
      requestId: requestId,
    });
  }
}
