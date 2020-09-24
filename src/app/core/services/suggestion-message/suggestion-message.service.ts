import {suggestionMessageUrl} from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISuggestionMessage } from '../../models/suggestion-message/suggestion-message';
import {Observable, Subject} from 'rxjs';
import {CompletePaginationParams} from '../../models/Pagination/completePaginationParameters';
import {IPage} from '../../models/page';
import {PaginationService} from '../pagination/pagination.service';

@Injectable({
  providedIn: 'root'
})
export class SuggestionMessageService {
  private apiUrl: string = suggestionMessageUrl;

  constructor(private http: HttpClient, private pagination: PaginationService) {}

  // observable message source
  private messageSubmitedSource = new Subject<ISuggestionMessage>();

  // observable message streams
  messageSubmited$ = this.messageSubmitedSource.asObservable();

  submitMessage(message: ISuggestionMessage) {
    this.messageSubmitedSource.next(message);
  }

  // get all
  getMessage() {
    return this.http.get<ISuggestionMessage[]>(this.apiUrl);
  }
  getMessagePage(paginationParameters: CompletePaginationParams): Observable<IPage<ISuggestionMessage>> {
    return this.pagination.getPaginatedPage<ISuggestionMessage>(suggestionMessageUrl + 'paginated', paginationParameters);
  }
  getMessageById(id: number) {
    return this.http.get<ISuggestionMessage>(this.apiUrl + id);
  }

  postMessage(message: ISuggestionMessage) {
    return this.http.post<ISuggestionMessage>(this.apiUrl, message);
  }

  deleteMessage(id: number) {
    return this.http.delete(this.apiUrl + id);
  }

  editMessage(message: ISuggestionMessage) {
    return this.http.put(this.apiUrl, message);
  }
}