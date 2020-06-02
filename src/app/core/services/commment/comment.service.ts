import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {commentChildUrl, commentRootUrl} from '../../../configs/api-endpoint.constants';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  readonly rootUrl = commentRootUrl;

  readonly childUrl = commentChildUrl;

  constructor(private http: HttpClient) {
  }

  async getComments(id) {
    return this.http.get(this.rootUrl + id).toPromise();
  }


  postComment(_text, _bookid, _ownerid) {
    return this.http.post(this.rootUrl,
      {
        text: _text,
        bookId: _bookid,
        ownerId: _ownerid
      });
  }

  deleteComment(_commentid, _ownerid) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        id: _commentid,
        ownerId: _ownerid
      }
    };
    return this.http.delete(this.rootUrl, options);
  }

  updateComment(_commentId, _text, _ownerId) {
  return  this.http.put(this.rootUrl, {
      id: _commentId,
      text: _text,
      ownerId: _ownerId
    });
  }
  postChildComment(_ids,_text, _ownerid) {
    return this.http.post(this.childUrl,
      {
        ids: _ids,
        text: _text,
        ownerId: _ownerid
      });
  }

  updateChildComment(_ids, _text, _ownerId) {
    return  this.http.put(this.childUrl, {
      ids: _ids,
      text: _text,
      ownerId: _ownerId
    });
  }

  deleteChildComment(_ids, _ownerid) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        ids: _ids,
        ownerId: _ownerid
      }
    };
    return this.http.delete(this.childUrl, options);
  }
}
