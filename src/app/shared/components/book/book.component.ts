import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RequestService } from 'src/app/core/services/request/request.service';
import { BookService } from 'src/app/core/services/book/book.service';
import { ActivatedRoute } from '@angular/router';
import { bookUrl } from 'src/app/configs/api-endpoint.constants';
import { IBook } from "src/app/core/models/book";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [RequestService, BookService]
})
export class BookComponent implements OnInit {

    readonly baseUrl = bookUrl;
    book: IBook;
    bookId: number;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private bookService:BookService,
    private requestService:RequestService
    ) {}
  
  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);

  this.bookService.getBookById(this.bookId).subscribe((value: IBook) => {
    this.book = value;
  });
  }
  
  requestBook() {
    this.requestService.requestBook(this.bookId);
  }
  

}
