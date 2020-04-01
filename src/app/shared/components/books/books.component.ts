import { Component, OnInit } from '@angular/core';
import { IBook } from 'src/app/core/models/book';
import { BooksService } from 'src/app/core/services/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books: IBook[];
  constructor(private bookService:BooksService) { }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(books_=>{
this.books = books_;
    });

  }

}
