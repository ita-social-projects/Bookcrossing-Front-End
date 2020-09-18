import { issueUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IIssue } from '../../models/issue';


@Injectable()
export class IssueService {
  private apiUrl: string = issueUrl;

  constructor(private http: HttpClient) {}

  // get all
  getIssue() {
    return this.http.get<IIssue[]>(this.apiUrl);
  }

  getIssueById(id: number) {
    return this.http.get<IIssue>(this.apiUrl + id);
  }

  postIssue(issue: IIssue) {
    return this.http.post<IIssue>(this.apiUrl, issue);
  }

  deleteIssue(id: number) {
    return this.http.delete(this.apiUrl + id);
  }

  editIssue(genre: IIssue) {
    return this.http.put(this.apiUrl, genre);
  }
}