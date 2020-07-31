import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IOuterBook } from '../../models/outerBook';
import { IPage } from '../../models/page';
import { outerBookUrl } from 'src/app/configs/api-endpoint.constants';
import { PaginationService } from '../pagination/pagination.service';
import { OuterBookQueryParams } from '../../models/outerBookQueryParams';

@Injectable({
  providedIn: 'root'
})
export class OuterServiceService {

  constructor(private http: HttpClient,
              private pagination: PaginationService) { }

  getBooks(paginationParameters: OuterBookQueryParams){
    return this.pagination.getOuterBookPage<IOuterBook>(outerBookUrl + 'books', paginationParameters);
  }

  getBooksById(bookId: number){
    return this.http.get<IOuterBook>(`${outerBookUrl}book/${bookId}`);
  }
}
