import { RequestQueryParams } from './../../models/requestQueryParams';
import { bookUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IBook } from "../../models/book";
import { bookState } from '../../models/bookState.enum';
import { RequestService } from '../request/request.service';
import { IRequest } from '../../models/request';
import {PaginationService} from "../pagination/pagination.service";
import {IPage} from "../../models/page";
import { BookQueryParams } from '../../models/bookQueryParams';
import { IBookPost } from '../../models/bookPost';
import { delay } from 'rxjs/operators';
import { promise } from 'protractor';
import { IBookPut } from '../../models/bookPut';

@Injectable()
export class BookService {
  private apiUrl: string = bookUrl;

  constructor(private http: HttpClient,
    private pagination: PaginationService,
    private requestService:RequestService
    ) {}

  getBooksPage(bookParams : BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(bookUrl,bookParams);
  }

  getCurrentOwnedBooks(bookParams: BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(this.apiUrl + 'current', bookParams);
  }

  getRegisteredBooks(bookParams: BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(this.apiUrl + 'registered', bookParams);
  }

  getReadBooks(bookParams: BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(this.apiUrl + 'read', bookParams);
  }

  getBookById(id: number): Observable<IBook> {
    return this.http.get<IBook>(this.apiUrl + id);
  }

  postBook(book: FormData):Observable<IBook> {
    return this.http.post<IBook>(this.apiUrl, book);
  }

  putBook(bookId: number, book: FormData):Observable<Object>{
    return this.http.put(this.apiUrl + bookId, book);
  }

  deactivateBook(bookId: number):Observable<Object>{
    return this.http.put(this.apiUrl + bookId + '/deactivate', undefined);
  }

  activateBook(bookId: number):Observable<Object>{
    return this.http.put(this.apiUrl + bookId + '/activate', undefined);
  }

  isBookOwned(bookId: number):Observable<boolean>{
    return this.http.get<boolean>(this.apiUrl + bookId + '/is-owned');
  }
}
