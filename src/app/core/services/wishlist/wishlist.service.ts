import { wishListUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBook } from '../../models/book';
import {PaginationService} from '../pagination/pagination.service';
import {IPage} from '../../models/page';
import { PageableParameters } from '../../models/Pagination/pageableParameters';

@Injectable()
export class WishListService {
  private apiUrl: string = wishListUrl;

  constructor(private http: HttpClient,
              private pagination: PaginationService
    ) {}

    getWishList(pageableParams: PageableParameters): Observable<IPage<IBook>> {
      return this.pagination.getPage<IBook>(this.apiUrl, pageableParams);
    }

    addToWishList(bookId: number): Observable<object> {
      return this.http.post(this.apiUrl + 'add', bookId);
    }

    removeFromWishList(bookId: number): Observable<object> {
      return this.http.delete(this.apiUrl + bookId);
    }

    isWished(bookId: number): Observable<boolean> {
      return this.http.get<boolean>(this.apiUrl + bookId + '/is-wished');
    }
}
