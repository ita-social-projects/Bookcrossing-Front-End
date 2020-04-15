import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAuthor } from 'src/app/core/models/author'
import { authorUrl } from "src/app/configs/api-endpoint.constants";
import { IPage } from '../../models/page';
import { PaginationParameters } from 'src/app/core/models/paginationParameters';
import { PaginationService } from '../pagination/pagination.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(private http: HttpClient, private pagination: PaginationService) {}  

  getAuthorsPage(paginationParameters : PaginationParameters):Observable<IPage<IAuthor>>{
    return this.pagination.getPage<IAuthor>(authorUrl,paginationParameters);
  }
  getAuthorById(authorId: number) {
    return this.http.get<IAuthor[]>(authorUrl + `/${authorId}`);
  }
  addAuthor(author : IAuthor){
    return this.http.post<IAuthor>(authorUrl, author);
  }
  updateAuthor(author: IAuthor) {
    return this.http.put<IAuthor>(authorUrl, author);
  }
}
