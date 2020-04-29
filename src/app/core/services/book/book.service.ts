
import { bookUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IBook } from "../../models/book";
import {PaginationService} from "../pagination/pagination.service";
import {PaginationParameters} from "../../../core/models/Pagination/paginationParameters";
import {IPage} from "../../models/page";
import {IAuthor} from "../../models/author";
import { BookParameters } from '../../models/Pagination/bookParameters';

@Injectable()
export class BookService {
  private apiUrl: string = bookUrl;

  constructor(
    private http: HttpClient,
    private pagination: PaginationService
  ) {}

  getBooksPage(bookParams : BookParameters): Observable<IPage<IBook>> {
    return this.pagination.getPageBooks<IBook>(bookUrl,bookParams);
  }

  getBookById(id: number): Observable<IBook> {
    return this.http.get<IBook>(this.apiUrl + id);
  }

  postBook(book: IBook) {
    return this.http.post<IBook>(this.apiUrl, book);
  }
}
