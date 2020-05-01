import { Component, OnInit } from '@angular/core';
import { IBook } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book/book.service';

@Component({
  selector: 'app-registered-book',
  templateUrl: './registered-book.component.html',
  styleUrls: ['./registered-book.component.scss']
})
export class RegisteredBookComponent implements OnInit {

  books: IBook[];
  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getRegisteredBooks().subscribe(books_=>{
      this.books = books_;
    });
  }
  makeRequest(bookId: number): void {
    alert(bookId);
  }
}
