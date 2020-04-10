import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAuthor } from 'src/app/core/models/author'
import { authorUrl } from "src/app/configs/api-endpoint.constants";

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(private http: HttpClient,) {}

  getAuthors():Observable<IAuthor[]>{
    return this.http.get<IAuthor[]>(authorUrl);
  }
  getAuthorById(authorId: number) {
    return this.http.get<IAuthor[]>(authorUrl + `/${authorId}`);
  }
  addAuthor(author : IAuthor){
    return this.http.post<IAuthor>(authorUrl, author);
  }
  deleteAuthor(authorId: number) {
    return this.http.delete<IAuthor>(authorUrl + `/${authorId}`);
  }
  updateAuthor(author: IAuthor) {
    return this.http.put<IAuthor>(authorUrl, author);
  }
}
