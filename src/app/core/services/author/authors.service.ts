import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IAuthor } from 'src/app/core/models/author'
import { authorUrl } from "src/app/configs/api-endpoint.constants";
import { IPage } from '../../models/page';
import { PaginationParameters } from 'src/app/core/models/Pagination/paginationParameters';
import { PaginationService } from '../pagination/pagination.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  constructor(
    private http: HttpClient,
    private pagination: PaginationService
  ) {}

   private authorEditedSource = new Subject<IAuthor>();

   authorEdited$ = this.authorEditedSource.asObservable();

   editAuthor(author: IAuthor) {
    this.authorEditedSource.next(author);
  }

  getAuthorsPage(paginationParameters : PaginationParameters):Observable<IPage<IAuthor>>{
    return this.pagination.getPage<IAuthor>(authorUrl,paginationParameters);
  }
  getAuthorById(authorId: number) {
    return this.http.get<IAuthor[]>(authorUrl + `/${authorId}`);
  }
  addAuthor(author: IAuthor) {
    return this.http.post<IAuthor>(authorUrl, author);
  }
  updateAuthor(author: IAuthor) {
    return this.http.put<IAuthor>(authorUrl, author);
  }
}
