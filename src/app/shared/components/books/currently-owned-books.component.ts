import { BooksComponent } from './books.component';
import { BookQueryParams } from 'src/app/core/models/bookQueryParams';
import { booksPage } from 'src/app/core/models/booksPage.enum';
import { Component } from '@angular/core';

@Component({
  selector: 'app-current-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})

export class CurrentlyOwnedBooksComponent extends BooksComponent {

    tooltip = this.translate.instant('components.books.likeTooltip');
    booksPage = booksPage.CurrentOwned;

    public getBooks(params: BookQueryParams): void {
        this.bookService.getCurrentOwnedBooks(params)
          .subscribe( {
            next: pageData => {
              this.books = pageData.page;
              for (let i = 0; i < pageData.page.length; i++) {
                this.getWhichBooksWished(pageData.page[i]);
                this.getUserWhoRequested(pageData.page[i], i);
              }
              if (pageData.totalCount) {
                this.totalSize = pageData.totalCount;
              }
            },
            error: err => {
              this.notificationService.error(this.translate
                .instant('Something went wrong!'), 'X');
            }
          });
      }
}
