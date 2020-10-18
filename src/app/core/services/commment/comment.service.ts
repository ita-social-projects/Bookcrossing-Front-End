import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {commentChildUrl, commentRootUrl} from '../../../configs/api-endpoint.constants';
import {IRootInsertComment} from '../../models/comments/root-comment/rootInsert';
import {IRootDeleteComment} from '../../models/comments/root-comment/rootDelete';
import {IRootUpdateComment} from '../../models/comments/root-comment/rootUpdate';
import {IChildDeleteComment} from '../../models/comments/child-comment/childDelete';
import {IChildUpdateComment} from '../../models/comments/child-comment/childUpdate';
import {IChildInsertComment} from '../../models/comments/child-comment/childInsert';
import {IRootComment} from '../../models/comments/root-comment/root';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private $commentActionEvent = new BehaviorSubject<boolean>(false);
  public currentEventState = this.$commentActionEvent.asObservable();

  readonly rootUrl = commentRootUrl;

  readonly childUrl = commentChildUrl;

  constructor(private http: HttpClient) {
  }

  public fireCommentActionEvent(): void {
    this.$commentActionEvent.next(!this.$commentActionEvent.getValue());
  }

  public getComments(id): Observable<IRootComment[]> {
    return this.http.get<IRootComment[]>(this.rootUrl + id);
  }

  public postComment(comment: IRootInsertComment): Observable<number> {
    return this.http.post<number>(this.rootUrl, comment);
  }

  public deleteComment(comment: IRootDeleteComment): Observable<number> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: comment
    };
    return this.http.delete<number>(this.rootUrl, options);
  }

  updateComment(comment: IRootUpdateComment): Observable<number> {
    return  this.http.put<number>(this.rootUrl, comment);
  }
  postChildComment(comment: IChildInsertComment) {
    return this.http.post(this.childUrl, comment);
  }

  updateChildComment(comment: IChildUpdateComment) {
    return  this.http.put(this.childUrl, comment);
  }

  deleteChildComment(comment: IChildDeleteComment) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: comment
    };
    return this.http.delete(this.childUrl, options);
  }
}
