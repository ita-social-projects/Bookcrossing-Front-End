import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/core/services/request/request.service';
// import { Book } from "src/app/core/models/book/book";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  constructor(
    public service: RequestService
    ) { }

  // bookInfo: Book;
  bookId: number;
  
  ngOnInit(): void {
  }

}
