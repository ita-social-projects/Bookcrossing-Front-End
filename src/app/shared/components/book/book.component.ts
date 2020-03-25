import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RequestService } from 'src/app/core/services/request/request.service';
import { BooksService } from 'src/app/core/services/books.service';
import { ActivatedRoute } from '@angular/router';
import { bookUrl } from 'src/app/configs/api-endpoint.constants';
import { book } from "src/app/core/models/book";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [RequestService, BooksService]
})
export class BookComponent implements OnInit {

    readonly baseUrl = bookUrl;
    book: book;
    bookId: number;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private bookService:BooksService,
    private requestService:RequestService
    ) {}
  
  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);

  this.bookService.getBookById(this.bookId).subscribe((value: book) => {
    this.book = value;
  });
  }
  

}
