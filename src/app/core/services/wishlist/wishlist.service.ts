import { RequestQueryParams } from './../../models/requestQueryParams';
import { wishListUrl } from '../../../configs/api-endpoint.constants';
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
import { PageableParameters } from '../../models/Pagination/pageableParameters';
import { IBookPost } from '../../models/bookPost';
import { delay } from 'rxjs/operators';
import { promise } from 'protractor';
import { IBookPut } from '../../models/bookPut';
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable()
export class WishListService {
  private apiUrl: string = wishListUrl;

  constructor(private http: HttpClient,
    private pagination: PaginationService,
    private requestService:RequestService
    ) {}



    getWishList(pageableParams: PageableParameters):Observable<IPage<IBook>>{
      return this.pagination.getPage<IBook>(this.apiUrl, pageableParams);
    }

    addToWishList(bookId: number):Observable<Object>{
      return this.http.post(this.apiUrl + "add", bookId);
    }

    removeFromWishList(bookId: number):Observable<Object>{
      return this.http.delete(this.apiUrl + bookId);
    }

    isWished(bookId:number):Observable<boolean>{
      return this.http.get<boolean>(this.apiUrl + bookId + '/is-wished');
    }
}
