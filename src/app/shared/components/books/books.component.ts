import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/core/services/books.service';
import { book } from 'src/app/core/models/book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books:book[];


  constructor(private bookService:BooksService) { }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(books=>{
      this.books = books;
    });
  }

}
