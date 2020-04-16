import { Component, OnInit } from '@angular/core';
import { IGenre } from 'src/app/core/models/genre';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IBook } from 'src/app/core/models/book';
import { IAuthor } from 'src/app/core/models/author';
import { BookService } from 'src/app/core/services/book/book.service';
import { GenreService } from 'src/app/core/services/genre/genre';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  constructor(
    private bookService: BookService,
    private genreService: GenreService
  ) {}
  addBookForm: FormGroup;
  authorControl: FormGroup;
  addNewAuthor: boolean = false;

  userId: number = 1;

  genres: IGenre[] = [];

  authors: IAuthor[] = [];

  ngOnInit(): void {
    this.buildForm();
    this.getAllGenres();
  }

  buildForm() {
    this.authorControl = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      middleName: new FormControl(null, Validators.required),
    });

    this.addBookForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      genres: new FormControl(null, Validators.required),
      publisher: new FormControl(null),
    });
  }

  onSubmit() {
    let genres: IGenre[] = [];
    for (let i = 0; i < this.addBookForm.get('genres').value.length; i++) {
      const id = this.addBookForm.get('genres').value[i];
      genres.push({ id: id, name: this.getGenreById(id) });
    }
    const book: IBook = {
      name: this.addBookForm.get('title').value,
      authors: this.authors,
      genres: genres,
      publisher: this.addBookForm.get('publisher').value,
      available: true,
      userId: this.userId,
    };
    this.bookService.postBook(book).subscribe(
      (data: IBook) => {
        alert('Successfully added');
      },
      (error) => {
        alert(error);
        console.log(error);
      }
    );

    this.authors = [];
    this.addBookForm.reset();
  }

  onAddAuthor() {
    const author: IAuthor = {
      firstName: this.authorControl.get('firstName').value,
      lastName: this.authorControl.get('lastName').value,
      middleName: this.authorControl.get('middleName').value,
    };

    this.addAuthor(author);
  }

  getGenreById(id: number) {
    return this.genres ? this.genres.find((genre) => genre.id == id)?.name : '';
  }

  getAllGenres() {
    this.genreService.getGenre().subscribe(
      (data) => {
        this.genres = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDeleteAuthor(author: IAuthor) {
    const index = this.authors.indexOf(author);
    if (index > -1) {
      this.authors.splice(index, 1);
    }
  }

  addAuthor(author) {
    const index = this.authors.findIndex((elem) => {
      return (
        elem.firstName.toLowerCase() === author.firstName.toLowerCase() &&
        elem.middleName.toLowerCase() === author.middleName.toLowerCase() &&
        elem.lastName.toLowerCase() === author.lastName.toLowerCase()
      );
    });
    if (index < 0) {
      this.authors.push(author);
    }
  }
}
