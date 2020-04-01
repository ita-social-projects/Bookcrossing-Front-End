import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IBook } from "../interfaces/book";

@Injectable()
export class BookService {
  constructor(private http: HttpClient) {}
  apiUrl: string = environment.apiUrl + "/books/";

  getBook(id: number) {
    return this.http.get<IBook>(this.apiUrl + id);
  }

}
