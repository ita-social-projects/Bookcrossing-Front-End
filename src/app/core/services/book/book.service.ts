import { RequestQueryParams } from './../../models/requestQueryParams';
import { bookUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBook } from '../../models/book';
import { bookState } from '../../models/bookState.enum';
import { RequestService } from '../request/request.service';
import { IRequest } from '../../models/request';
import {PaginationService} from '../pagination/pagination.service';
import {IPage} from '../../models/page';
import { BookQueryParams } from '../../models/bookQueryParams';
import { IBookPost } from '../../models/bookPost';
import { delay } from 'rxjs/operators';
import { promise } from 'protractor';
import { IBookPut } from '../../models/bookPut';
import {BookRatingQueryParams} from '../../models/bookRatingQueryParams';
import {IMapLocation} from '../../models/books-map/map-location';

@Injectable()
export class BookService {
  private apiUrl: string = bookUrl;

  constructor(private http: HttpClient,
              private pagination: PaginationService
    ) {}

  public getBooksPage(bookParams: BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(bookUrl, bookParams);
  }

  public getCurrentOwnedBooks(bookParams: BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(this.apiUrl + 'current', bookParams);
  }

  public getCurrentReadBooks(bookParams: BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(this.apiUrl + 'currentlyread', bookParams);
  }

  public getCurrentBooksOfUser(userId: number): Observable<IBook[]> {
    return this.http.get<IBook[]>(this.apiUrl + `current/${userId}`);
  }

  public getRegisteredBooks(bookParams: BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(this.apiUrl + 'registered', bookParams);
  }

  public getReadBooks(bookParams: BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(this.apiUrl + 'read', bookParams);
  }

  public getBookById(id: number): Observable<IBook> {
    return this.http.get<IBook>(this.apiUrl + id);
  }

  public postBook(book: FormData): Observable<IBook> {
    return this.http.post<IBook>(this.apiUrl, book);
  }

  public putBook(bookId: number, book: FormData): Observable<object> {
    return this.http.put(this.apiUrl + bookId, book);
  }

  public deactivateBook(bookId: number): Observable<object> {
    return this.http.put(this.apiUrl + bookId + '/deactivate', undefined);
  }

  public activateBook(bookId: number): Observable<object> {
    return this.http.put(this.apiUrl + bookId + '/activate', undefined);
  }

  public getUserRating(bookId: number, userId: number): Observable<number> {
    return this.http.get<number>(this.apiUrl + `rating/${bookId}/user/${userId}`);
  }

  public setUserRating(ratingParams: BookRatingQueryParams): Observable<boolean> {
    let params = new HttpParams();
    params = params
      .set('BookId', ratingParams.bookId.toString())
      .set('UserId', ratingParams.userId.toString())
      .set('Rating', ratingParams.rating.toString());

    return this.http.post<boolean>(this.apiUrl + 'rating', null, {params});
  }

  public getBooksQuantityOnLocations(): Observable<IMapLocation[]> {
    return this.http.get<IMapLocation[]>(this.apiUrl + 'locations');
  }
}
