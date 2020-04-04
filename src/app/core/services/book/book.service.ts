import { bookUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IBook } from "../../models/book";

@Injectable()
export class BookService {
  readonly baseUrl = bookUrl;

  constructor(private http: HttpClient) {}

   getBooks():Observable<IBook[]>{
     return this.http.get<IBook[]>(this.baseUrl);
   }

   getBookById(id:number):Observable<IBook>{
     var url = this.baseUrl + '/';
     var url_ = url.concat(id.toString());
     return this.http.get<IBook>(url_)
   }

  postBook(book: IBook) {
    return this.http.post<IBook>(this.baseUrl, book);
  }
}
