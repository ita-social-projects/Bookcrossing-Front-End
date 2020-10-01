import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {IIssue} from '../../models/issue';
import {issueUrl} from '../../../configs/api-endpoint.constants';
import {CompletePaginationParams} from '../../models/Pagination/completePaginationParameters';
import {IPage} from '../../models/page';
import {PaginationService} from '../pagination/pagination.service';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  public formIssue: IIssue;
  private issueSubmittedSource = new Subject<IIssue>();
  languageSubmitted = this.issueSubmittedSource.asObservable();
  constructor(private http: HttpClient, private pagination: PaginationService) { }

  submitIssue(issue: IIssue) {
    this.issueSubmittedSource.next(issue);
  }

  getIssues(): Observable<IIssue[]> {
    return this.http.get<IIssue[]>(issueUrl);
  }

  getIssuePage(paginationParameters: CompletePaginationParams): Observable<IPage<IIssue>> {
    return this.pagination.getPaginatedPage<IIssue>(issueUrl + 'paginated', paginationParameters);
  }

  getIssueById(issueId: number) {
    return this.http.get<IIssue[]>( issueUrl + `/${issueId}`);
  }

  addIssue(issue: IIssue) {
    return this.http.post<IIssue>(issueUrl, issue);
  }

  deleteIssue(issueId: number) {
    return this.http.delete<IIssue>(issueUrl + `${issueId}`);
  }

  updateIssue(issue: IIssue) {
    return this.http.put<IIssue>(issueUrl, issue);
  }
}
