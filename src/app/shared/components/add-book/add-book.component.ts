import { Component, OnInit } from "@angular/core";
import { IGenre } from "src/app/core/models/genre";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IBook } from "src/app/core/models/book";
import { IAuthor } from "src/app/core/models/author";
import { BookService } from "src/app/core/services/book/book.service";
import { GenreService } from "src/app/core/services/genre/genre";
import { AuthorService } from "src/app/core/services/author/authors.service";
import { SubscriptionLike } from "rxjs";
import { Router } from "@angular/router";
import { IBookPost } from "src/app/core/models/bookPost";
import { AuthenticationService } from "src/app/core/services/authentication/authentication.service";
import { DialogService } from "src/app/core/services/dialog/dialog.service";
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: "app-add-book",
  templateUrl: "./add-book.component.html",
  styleUrls: ["./add-book.component.scss"],
})
export class AddBookComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private bookService: BookService,
    private genreService: GenreService,
    private authorService: AuthorService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  addBookForm: FormGroup;

  userId: number;
  genres: IGenre[] = [];
  selectedAuthors: IAuthor[] = [];
  authors: IAuthor[] = [];
  selectedFile = null;
  authorsSubscription: SubscriptionLike;
  submitted = false;
  authorFocused: boolean = false;

  ngOnInit(): void {
    this.buildForm();
    this.getAllGenres();
    this.authorsSubscription = this.addBookForm
      .get("author")
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
    this.addBookForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      genres: new FormControl(null, Validators.required),
      publisher: new FormControl(null),
      author: new FormControl(null),
      description: new FormControl(null),
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.validateForm(this.addBookForm)) {
      console.log("asdasd");
      return;
    }

    // parse selected genres
    const selectedGenres: IGenre[] = [];
    for (let i = 0; i < this.addBookForm.get("genres").value?.length; i++) {
      const id = this.addBookForm.get("genres").value[i];
      selectedGenres.push({ id: id, name: this.getGenreById(id) });
    }

    const newAuthor: string = this.addBookForm.get("author").value;
    if (newAuthor) {
      console.log("new Author");
      this.addNewAuthor(newAuthor);
    }

    let book: IBookPost = {
      name: this.addBookForm.get("title").value,
      authors: this.selectedAuthors,
      genres: selectedGenres,
      publisher: this.addBookForm.get("publisher").value,
      notice: this.addBookForm.get("description").value,
      available: true,
      userId: this.userId,
    };

    if (this.selectedFile) {
      book.image = this.selectedFile;
    }

    const formData: FormData = this.getFormData(book);

    this.bookService.postBook(formData).subscribe(
      (data: IBook) => {
        this.notificationService.success(this.translate.instant("Book is registered successfully"), "X");
        this.goToPage("book", data.id);
      },
      (error) => {
        console.log(error);
        this.notificationService.warn(this.translate.instant("Something went wrong"), "X");
      }
    );

    // this.goToPage("books");
    this.selectedAuthors = [];

    // after submmit subscription stops work
    this.authorsSubscription.unsubscribe();
    this.authorsSubscription = this.addBookForm
      .get("author")
      .valueChanges.subscribe((input) => {
        this.filterAuthors(input);
      });
  }

  validateForm(form: FormGroup): boolean {
    if (!this.userId) {
      this.notificationService.warn(this.translate.instant("You have to be logged in to register book"), "X");
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
    return this.genres ? this.genres.find((genre) => genre.id == id)?.name : "";
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
    console.log(event);
    this.addBookForm.get("author").setValue("");
    this.addAuthor(event.option.value);
  }

  // redirecting method
  goToPage(pageName: string, id?: number) {
    this.router.navigate([`${pageName}/${id ? id : ""}`]);
  }

  getFormData(book: IBookPost): FormData {
    const formData = new FormData();
    Object.keys(book).forEach((key, index) => {
      if (book[key]) {
        if (Array.isArray(book[key])) {
          book[key].forEach((i, index) => {
            formData.append(`${key}[${index}][id]`, book[key][index]["id"]);
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

 async onCancel() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Are yo sure want to cancel?").toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.goToPage('books');
          }
      });
  }
}
