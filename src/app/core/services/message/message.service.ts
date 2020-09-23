import {messagesUrl} from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserMessage } from '../../models/userMessage';
import {Observable, Subject} from 'rxjs';
import {CompletePaginationParams} from '../../models/Pagination/completePaginationParameters';
import {IPage} from '../../models/page';
import {PaginationService} from '../pagination/pagination.service';

@Injectable()
export class MessageService {
  private apiUrl: string = messagesUrl;

  constructor(private http: HttpClient, private pagination: PaginationService) {}

  // observable message source
  private messageSubmitedSource = new Subject<IUserMessage>();

  // observable message streams
  messageSubmited$ = this.messageSubmitedSource.asObservable();

  submitMessage(message: IUserMessage) {
    this.messageSubmitedSource.next(message);
  }

  // get all
  getMessage() {
    return this.http.get<IUserMessage[]>(this.apiUrl);
  }
  getMessagesPage(paginationParameters: CompletePaginationParams): Observable<IPage<IUserMessage>> {
    return this.pagination.getPaginatedPage<IUserMessage>(messagesUrl + 'paginated', paginationParameters);
  }
  getMessageById(id: number) {
    return this.http.get<IUserMessage>(this.apiUrl + id);
  }

  postMessage(message: IUserMessage) {
    return this.http.post<IUserMessage>(this.apiUrl, message);
  }

  deleteMessage(id: number) {
    return this.http.delete(this.apiUrl + id);
  }

  editMessage(message: IUserMessage) {
    return this.http.put(this.apiUrl, message);
  }
}