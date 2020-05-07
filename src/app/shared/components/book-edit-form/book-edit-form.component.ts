import { IBookPost } from './../../../core/models/bookPost';
import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { IAuthor } from "src/app/core/models/author";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookService } from 'src/app/core/services/book/book.service';
import { IBook } from 'src/app/core/models/book';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { AuthorService } from 'src/app/core/services/author/authors.service';
import { GenreService } from 'src/app/core/services/genre/genre';
import { IGenre } from 'src/app/core/models/genre';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';

@Component({
  selector: 'app-author-form',
  templateUrl: './book-edit-form.component.html',
  styleUrls: ['./book-edit-form.component.scss']
})
export class BookEditFormComponent implements OnInit {

@Output() onCancel : EventEmitter<void> = new EventEmitter<void>()
@Input() book : IBook

editBookForm: FormGroup;

  userId: number;
  genres: IGenre[] = [];
  selectedAuthors: IAuthor[] = [];
  authors: IAuthor[] = [];
  selectedFile = null;
  authorsSubscription: SubscriptionLike;
  submitted = false;
  authorFocused: boolean = false;
  selectedGenres = [];

constructor(
  private translate: TranslateService,
  private notificationService: NotificationService,
  private dialogService: DialogService,
  private bookService: BookService,
  private genreService: GenreService,
  private authorService: AuthorService,
  private authenticationService: AuthenticationService,
  private router: Router
) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAllGenres();
    this.authorsSubscription = this.editBookForm
      .get('author')
      .valueChanges.subscribe((input) => {
        this.filterAuthors(input);
      });
      if (this.isAuthenticated()) {
        this.authenticationService.getUserId().subscribe(
          (response: number) => {
            this.userId = response;
            console.log(this.userId);
          },
          (error) => {
            console.log("fetching userId error");
          }
        );
      }
  }
  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }
  filterAuthors(input: string) {
    if (input?.length <= 2) {
      this.authors = [];
    }
    if (input?.length === 2) {
      this.authorService.getFilteredAuthors(input).subscribe(
        (data) => {
          this.authors = data;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  buildForm() {
    this.editBookForm = new FormGroup({
      title: new FormControl({value:this.book.name, disabled: false}, Validators.required),
      genres: new FormControl(null, Validators.required),
      publisher: new FormControl({value:this.book.publisher, disabled: false}),
      author: new FormControl(null),
      description: new FormControl({value:this.book.notice, disabled: false}),
      image: new FormControl({value:this.book.imagePath, disabled: false}),
    });
    if(this.book.authors){
      this.book.authors.forEach(element => {
        this.addAuthor(element);
      });
    }
    if(this.book.genres){
      this.book.genres.forEach(element => {
        this.selectedGenres.push(element.id)
      });
    }
  }

  isFileExists(){
    if(this.book.imagePath){
      if(!this.selectedFile){
        return true;
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.validateForm(this.editBookForm)) {
      return;
    }
    // parse selected genres
    const selectedGenres: IGenre[] = [];
    for (let i = 0; i < this.editBookForm.get('genres').value?.length; i++) {
      const id = this.editBookForm.get('genres').value[i];
      selectedGenres.push({ id: id, name: this.getGenreById(id) });
    }

    const newAuthor: string = this.editBookForm.get('author').value;
    if (newAuthor) {
      this.addNewAuthor(newAuthor);
    }

    let book: IBookPost = {
      id: this.book.id,
      name: this.editBookForm.get('title').value,
      authors: this.selectedAuthors,
      genres: selectedGenres,
      publisher: this.editBookForm.get('publisher').value,
      notice: this.editBookForm.get('description').value,
      available: true,
      userId: this.userId,
    };

    // if (this.selectedFile) {
    //   book.image = this.selectedFile;
    // }

    this.bookService.putBook(book.id, book).subscribe(
      (data: boolean) => {
        this.notificationService.success(this.translate.instant("Book is edited successfully"), "X");
        this.onCancel.emit();
      },
      (error) => {
        this.notificationService.warn(this.translate.instant("Something went wrong"), "X");
      }
    );
    this.ngOnInit();
    this.selectedAuthors = [];
    this.editBookForm.reset();

    // after submmit subscription stops work
    this.authorsSubscription.unsubscribe();
    this.authorsSubscription = this.editBookForm
      .get('author')
      .valueChanges.subscribe((input) => {
        this.filterAuthors(input);
      });
  }
  validateForm(form: FormGroup): boolean {
    if (!this.userId) {
      this.notificationService.warn(this.translate.instant("You have to be logged in to edit book"), "X");
      return true;
    } else if (!form.get("author").value && !this.selectedAuthors.length) {
      return true;
    } else if (form.invalid) {
      return true;
    } else {
      return false;
    }
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
    const index = this.selectedAuthors.indexOf(author);
    if (index > -1) {
      this.selectedAuthors.splice(index, 1);
    }
  }
  

  addAuthor(author) {
    const index = this.selectedAuthors.findIndex((elem) => {
      return (
        elem.firstName?.toLowerCase() === author.firstName?.toLowerCase() &&
        elem.middleName?.toLowerCase() === author.middleName?.toLowerCase() &&
        elem.lastName?.toLowerCase() === author.lastName?.toLowerCase()
      );
    });
    if (index < 0) {
      this.selectedAuthors.push(author);
    }
  }

  addNewAuthor(newAuthor: string) {
    const author = this.parseAuthorString(newAuthor);
    this.addAuthor(author);
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  // parses string and returns IAuthor object
  parseAuthorString(input: string): IAuthor {
    console.log(input);
    input = input.trim();
    const words = input.split(/\s+/g);
    const firstName = words[0];
    let lastName = null;
    let middleName = null;

    // if input string contains > 3 words - second is middleName
    if (words.length > 2) {
      middleName = words[1];
      lastName = words[2];
    } else {
      lastName = words[1];
    }
    const author: IAuthor = {
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
    };
    console.log(author);
    return author;
  }

  onAuthorSelect(event) {
    this.editBookForm.get('author').setValue('');
    this.addAuthor(event.option.value);
  }

  getFormData(book: IBookPost): FormData {
    const formData = new FormData();
    Object.keys(book).forEach((key, index) => {
      if (book[key]) {
        if (Array.isArray(book[key])) {
          book[key].forEach((i, index) => {
            formData.append(`${key}[${index}][id]`, book[key][index]['id']);
          });
        } else {
          formData.append(key, book[key]);
        }
      }
    });
    return formData;
  }

  onFileClear() {
    this.selectedFile = null;
  }
  async cancel() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Are yo sure want to cancel?").toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.onCancel.emit();
    this.editBookForm.reset();
          }
      });
  }
}
