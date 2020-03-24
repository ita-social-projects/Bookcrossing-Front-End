import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { requestUrl } from "src/app/configs/api-endpoint.constants";
import { Request } from 'src/app/core/models/request/request';

@Injectable()
export class RequestService {
  constructor(
    private http: HttpClient,
  ) {}

  readonly baseUrl = requestUrl;

  requestBook(bookId: number) {
    this.http.post<Request>(this.baseUrl + `/${bookId}`, {
      bookId: bookId,
    });
  }

  getAllRequestesByBookId(bookId: number) {
    return this.http.get<Request[]>(this.baseUrl + `/${bookId}`);
  }

  deleteRequest(requestId: number) {
    return this.http.delete<Request>(this.baseUrl + `/${requestId}`);
  }

  approveRequest(requestId: number) {
    return this.http.put<Request>(this.baseUrl + `/${requestId}`, {
      requestId: requestId,
    });
  }
}
