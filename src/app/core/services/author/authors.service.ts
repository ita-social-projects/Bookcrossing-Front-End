import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IAuthor } from 'src/app/core/models/author';
import { authorUrl } from 'src/app/configs/api-endpoint.constants';
import { IPage } from '../../models/page';
import { CompletePaginationParams } from 'src/app/core/models/Pagination/completePaginationParameters';
import { PaginationService } from '../pagination/pagination.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  constructor(
    private http: HttpClient,
    private pagination: PaginationService
  ) {}
   public formAuthor: IAuthor;
   public formMergeAuthors: IAuthor[];
   private authorSubmittedSource = new Subject<IAuthor>();
   authorSubmitted = this.authorSubmittedSource.asObservable();

   submitAuthor(author: IAuthor) {
    this.authorSubmittedSource.next(author);
  }

  getAuthorsPage(paginationParameters: CompletePaginationParams): Observable<IPage<IAuthor>> {
    return this.pagination.getPaginatedPage<IAuthor>(authorUrl + '/paginated', paginationParameters);
  }
  getAuthorById(authorId: number){
     return this.http.get<IAuthor>(authorUrl + `/${authorId}`);
  }
  mergeAuthors(author: IAuthor, authorIds: number[]) {
     let params = new HttpParams();
     if (authorIds?.length > 0) {
      for (const id of authorIds) {
        params = params.append('authors', id.toString());
      }
    }
     return this.http.put<IAuthor[]>(authorUrl + '/merge', {authors: authorIds, author});
  }
  addAuthor(author: IAuthor) {
    return this.http.post<IAuthor>(authorUrl, author);
  }
  updateAuthor(author: IAuthor) {
    return this.http.put<IAuthor>(authorUrl, author);
  }

  getFilteredAuthors(filter: string) {
    return this.http.get<IAuthor[]>(authorUrl + `/${filter}`);
  }
}
