import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IBook } from "../models/book";
import { environment } from "src/environments/environment";

@Injectable()
export class BooksService {
  apiUrl: string = environment.apiUrl + "/Books";

  constructor(private http: HttpClient) {}

  getBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(this.apiUrl);
  }

  getBookById(id: number): Observable<IBook> {
    let url = this.apiUrl;
    let url_ = url.concat(id.toString());
    return this.http.get<IBook>(url_);
  }

  postBook(book: IBook) {
    return this.http.post<IBook>(this.apiUrl, book);
  }
}
