import { bookUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IBook } from "../../models/book";

@Injectable()
export class BookService {
  private apiUrl: string = bookUrl;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(this.apiUrl);
  }

  getBookById(id: number): Observable<IBook> {
    return this.http.get<IBook>(this.apiUrl + id);
  }

  postBook(book: IBook) {
    return this.http.post<IBook>(this.apiUrl, book);
  }
}
