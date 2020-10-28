import { FoundBooksComponent } from 'src/app/shared/components/found-books/found-books.component';
import { Component, OnInit } from '@angular/core';
import { IBookPost } from 'src/app/core/models/bookPost';
import { IOuterBook } from 'src/app/core/models/outerBook';
import { bookState } from 'src/app/core/models/bookState.enum';
import { IAuthor } from 'src/app/core/models/author';
import { IGenre } from 'src/app/core/models/genre';

@Component({
  selector: 'app-request-from-company',
  templateUrl: './request-from-company.component.html',
  styleUrls: ['./request-from-company.component.scss'],
})
export class RequestFromCompanyComponent extends FoundBooksComponent {
  authors: IAuthor[] = [];
  genres: IGenre[] = [];
  selectedFile;
  newBook: IBookPost;

  public async requestFromCompany(book: IOuterBook): Promise<void> {
    this.genres = [];
    this.authors = [];
    this.selectedFile = null;
    const names = book.author.fullName.split(' ');
    if (names.length === 1) {
      names.push(' ');
    }
    const author: IAuthor = {
      firstName: names[0],
      lastName: names[1],
      isConfirmed: false,
    };
    await this.authorService.addAuthor(author).subscribe(async (auth) => {
      this.authors.push(auth);

      if (book.imageUrl.indexOf('assets/nophoto') >= 0) {
        this.newBook = {
          name: book.title,
          userId: 3, // default
          publisher: book.publisher,
          isbn: book.isbn,
          state: bookState.requestedFromCompany,
          notice: book.description,
          image: null,
          languageId: 1, // default
          authors: this.authors,
          genres: this.genres, // default
        };
        this.addBook();
      } else {
        await fetch(book.imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            this.selectedFile = new File(
              [blob],
              book.imageUrl.substring(book.imageUrl.lastIndexOf('/') + 1)
            );

            this.newBook = {
              name: book.title,
              userId: 3, // default
              publisher: book.publisher,
              isbn: book.isbn,
              state: bookState.requestedFromCompany,
              notice: book.description,
              image: this.selectedFile,
              languageId: 1, // default
              authors: this.authors,
              genres: this.genres, // default
            };
            this.addBook();
          });
      }
    });
  }

  public addBook() {
    this.bookService.postBook(this.getFormData(this.newBook)).subscribe((b) => {
      this.notificationService.success(
        this.translate.instant('Book is successfully requested from company!'),
        'X'
      );
      this.wishListService.addToWishList(b.id).subscribe(() => {
        this.router.navigate(['book/' + b.id]);
      });
    });
  }

  public getFormData(book: IBookPost): FormData {
    const formData = new FormData();
    Object.keys(book).forEach((key, _) => {
      if (book[key]) {
        if (Array.isArray(book[key])) {
          book[key].forEach((i, index) => {
            formData.append(`${key}[${index}][id]`, book[key][index].id);
          });
        } else {
          formData.append(key, book[key]);
        }
      }
    });
    return formData;
  }
}
