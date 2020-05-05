import { RequestQueryParams } from './../../models/requestQueryParams';
import { bookUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IBook } from "../../models/book";
import { bookStatus } from '../../models/bookStatus.enum';
import { RequestService } from '../request/request.service';
import { IRequest } from '../../models/request';
import {PaginationService} from "../pagination/pagination.service";
import {IPage} from "../../models/page";
import { BookQueryParams } from '../../models/bookQueryParams';
import { IBookPost } from '../../models/bookPost';
import { delay } from 'rxjs/operators';
import { promise } from 'protractor';

@Injectable()
export class BookService {
  private apiUrl: string = bookUrl;
  private isReceived: boolean;

  constructor(private http: HttpClient,
    private pagination: PaginationService,
    private requestService:RequestService
    ) {}

  getBooksPage(bookParams : BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(bookUrl,bookParams);
  }

  getCurrentOwnedBooks(bookParams: BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(bookUrl + 'current', bookParams);
  }

  getRegisteredBooks(bookParams: BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(this.apiUrl + 'registered', bookParams);
  }

  getBookById(id: number): Observable<IBook> {
    return this.http.get<IBook>(this.apiUrl + id);
  }

  postBook(book: FormData) {
    return this.http.post<IBook>(this.apiUrl, book);
  }

  putBook(bookId: number, book: IBookPost){
    return this.http.put(this.apiUrl + bookId, book);
  }

  async isBeingReding(bookId: number): Promise<boolean>{  
     let received: boolean;
     var query: RequestQueryParams = new RequestQueryParams();
     query.last = true;    
     let promise = new Promise<boolean>((resolve) => {
       this.requestService.getRequestForBook(bookId, query).subscribe({
         next: value => {
           if(value.receiveDate){
             resolve(true);
           }
         },
         error: () => {
           resolve(false);
         }
       })
     })
     await promise.then(value=> received = value)
     return received;
  }

  getStatus(book : IBook) : bookStatus{
    let requested = this.isRequested(book);
    if(requested){
      let received = this.isBeingReding(book.id);
      if(received){
        return bookStatus.reading;
      }
      else {
        return bookStatus.requested;
      }
    }
    return bookStatus.available;
  }
  
  isRequested(book: IBook) : boolean {      
    if(book.available === false) {
      return true;
    }
    return false;
  };
}
