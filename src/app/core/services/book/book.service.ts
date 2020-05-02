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

@Injectable()
export class BookService {
  private apiUrl: string = bookUrl;
  status: bookStatus;
  receiveDate: Date;

  constructor(private http: HttpClient,
    private pagination: PaginationService,
    private requestService:RequestService
    ) {}

  getBooksPage(bookParams : BookQueryParams): Observable<IPage<IBook>> {
    return this.pagination.getBookPage<IBook>(bookUrl,bookParams);
  }

  getRegisteredBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(this.apiUrl + 'registered');
  }

  getBookById(id: number): Observable<IBook> {
    return this.http.get<IBook>(this.apiUrl + id);
  }

  postBook(book: IBook) {
    return this.http.post<IBook>(this.apiUrl, book);
  }

  putBook(bookId: number, book: IBook) {
    return this.http.put<IBook>(this.apiUrl + bookId, {
      Id: bookId,
      book
    });
  }

  isBeingReding(book: IBook) : boolean {  
     var query: RequestQueryParams = new RequestQueryParams();
     query.last = true;    
     this.requestService.getRequestForBook(book.id, query)
    .subscribe((value: IRequest) => {
      this.receiveDate = value.receiveDate
      });
      if(this.receiveDate){
        this.status = bookStatus.reading;
      return true;
      }
      return false;
  };

  getStatus(book : IBook) : bookStatus{
    this.status = bookStatus.available;
    let requested = this.isRequested(book);
    if(requested){
      let received = this.isBeingReding(book);
      if(received){
        return this.status;
      }
      else {
        return this.status;
      }
    }
    return this.status;
  }
  
  isRequested(book: IBook) : boolean {      
    if(book.available === false) {
      this.status = bookStatus.requested
      return true;
    }
    return false;
  };
}
