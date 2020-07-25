import { Component, OnInit, ViewChild } from '@angular/core';
import { IGenre } from 'src/app/core/models/genre';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IBook } from 'src/app/core/models/book';
import { IAuthor } from 'src/app/core/models/author';
import { BookService } from 'src/app/core/services/book/book.service';
import { GenreService } from 'src/app/core/services/genre/genre';
import { AuthorService } from 'src/app/core/services/author/authors.service';
import { SubscriptionLike } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IBookPost } from 'src/app/core/models/bookPost';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { bookState } from '../../../core/models/bookState.enum';
import { ILanguage } from '../../../core/models/language';
import { BookLanguageService } from '../../../core/services/bookLanguage/bookLanguage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { OuterServiceService } from 'src/app/core/services/outerService/outer-service.service';
import { IOuterBook } from 'src/app/core/models/outerBook';
import { AutofillMonitor } from '@angular/cdk/text-field';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  
  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private bookService: BookService,
    private genreService: GenreService,
    private authorService: AuthorService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private dialogService: DialogService,
    private bookLanguageService: BookLanguageService,
    private outerService:OuterServiceService,
    private activeroute:ActivatedRoute
  ) { }

  addBookForm: FormGroup;

  userId: number;
  genres: IGenre[] = [];
  selectedAuthors: IAuthor[] = [];
  authors: IAuthor[] = [];
  selectedFile = null;
  authorsSubscription: SubscriptionLike;
  submitted = false;
  submittedValid = false;
  authorFocused = false;
  newAuthor: IAuthor;
  withoutAuthorChecked = false;
  languages: ILanguage[] = [];
  outerBook: IOuterBook;
  hideErrorInterval: NodeJS.Timeout;


  ngOnInit(): void{
    this.buildForm();
    this.getAllGenres();
    this.getAllLanguages();
    this.authorsSubscription = this.addBookForm
      .get('authorFirstname')
      .valueChanges.subscribe((input) => {
        if (typeof input === 'string') {
          this.filterAuthors(input?.trim());
        }
        if (this.isAuthorTyped(input)) {
          this.parseAuthors(input);
          input = '';
        }
      });

    if (this.isAuthenticated()) {
      this.authenticationService.getUserId().subscribe(
        (response: number) => {
          this.userId = response;
        },
        (error) => {
          console.log('fetching userId error');
        }
      );
    }

    this.activeroute.queryParams.subscribe((params) => {
      if (params['outerBookId']) {
        this.outerService.getBooksById(params['outerBookId']).subscribe(outerBook => { this.outerBook = outerBook;
        this.autoFill();
        });
      }
    })
  }

  autoFill() {
    console.log(this.outerBook);
    this.addBookForm.get('title').setValue(this.outerBook.title);
    this.addBookForm.get('description').setValue(this.outerBook.description);
    this.addBookForm.get('publisher').setValue(this.outerBook.publisher);
    for (var i=0; i<this.outerBook.authors.length; i++) {
      this.addBookForm.get('authorFirstname').setValue(this.outerBook.authors[i].fullName);
      }
  }

  setSearchTerm(searchTerm: string) {

    this.router.navigate(['found-books'], {queryParams: {'searchTerm' : searchTerm}});
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
      title: new FormControl('', Validators.required),
      genres: new FormControl(null, Validators.required),
      publisher: new FormControl(null),

      // authorLastname: new FormControl(null),
      authorFirstname: new FormControl(null),
      description: new FormControl(null),
      languageId: new FormControl(null, Validators.required),
      image: new FormControl('')
    });
  }

  async onSubmit() {
    if (this.submittedValid) {
      return;
    }

    this.submitted = this.submittedValid = true;
    this.addBookForm.markAllAsTouched();
    if (this.validateForm(this.addBookForm)) {
      this.submittedValid = false;
      return;
    }

    // parse selected genres
    const selectedGenres: IGenre[] = [];
    for (let i = 0; i < this.addBookForm.get('genres').value?.length; i++) {
      const id = this.addBookForm.get('genres').value[i];
      selectedGenres.push({ id, name: this.getGenreById(id) });
    }

    const authorInput = this.addBookForm.get('authorFirstname').value.trim();
    if (authorInput) {
      this.parseAuthors(authorInput);
      this.newAuthor = undefined;
    }

    const bookAuthors: IAuthor[] = this.selectedAuthors
      .slice()
      .filter((x) => x.isConfirmed === true);
    const newAuthors = this.selectedAuthors.filter(
      (x) => x.isConfirmed === false
    );

    for (let i = 0; i < newAuthors.length; i++) {
      const author = await this.addNewAuthor(newAuthors[i]);
      bookAuthors.push(author);
    }

    const book: IBookPost = {
      name: this.addBookForm.get('title').value,
      authors: bookAuthors,
      genres: selectedGenres,
      publisher: this.addBookForm.get('publisher').value,
      notice: this.addBookForm.get('description').value,
      state: bookState.available,
      userId: this.userId,
      languageId: this.addBookForm.get('languageId').value,
      image: this.addBookForm.get('image').value
    };

    if (this.withoutAuthorChecked) {
      book.authors = [];
    }

    if (this.selectedFile) {
      book.image = this.selectedFile;
    }
    const formData: FormData = this.getFormData(book);

    this.bookService.postBook(formData).subscribe(
      (data: IBook) => {
        this.notificationService.success(
          this.translate.instant('Book is registered successfully'),
          'X'
        );
        this.goToPage('book', data.id);
      },
      (error) => {
        this.submittedValid = false;
        console.log(error);
        this.notificationService.error(
          this.translate.instant('Something went wrong'),
          'X'
        );
      }
    );

    // this.goToPage("books");
    this.selectedAuthors = [];

    // after submit subscription stops work
    this.authorsSubscription.unsubscribe();
    this.authorsSubscription = this.addBookForm
      .get('authorFirstname')
      .valueChanges.subscribe((input) => {
        if (typeof input === 'string') {
          this.filterAuthors(input?.trim());
        }
        if (this.isAuthorTyped(input)) {
          this.parseAuthors(input);
          input = '';
        }
      });
  }

  // returns true is invalid
  validateForm(form: FormGroup): boolean {
    if (!this.userId) {
      this.notificationService.error(
        this.translate.instant('You have to be logged in to register book'),
        'X'
      );
      return true;
    } else if (
      !form.get('authorFirstname').value?.trim() &&
      !this.selectedAuthors.length &&
      !this.withoutAuthorChecked
    ) {
      return true;
    } else if (form.invalid) {
      return true;
    } else if (
      !this.withoutAuthorChecked &&
      form.get('authorFirstname').value?.trim()
    ) {
      return !this.checkAuthorLastName(form.get('authorFirstname').value);
    } else {
      return false;
    }
  }

  async addNewAuthor(newAuthor) {
    const author = await this.authorService.addAuthor(newAuthor).toPromise();
    return author;
  }

  addAuthor(authors, author: IAuthor) {
    const index = this.authors.findIndex((elem) => {
      return (
        elem?.firstName?.toLowerCase() === author.firstName?.toLowerCase() &&
        elem?.lastName?.toLowerCase() === author.lastName?.toLowerCase()
      );
    });
    if (index < 0) {
      authors.push(author);
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

  getAllLanguages() {
    this.bookLanguageService.getLanguage().subscribe(
      (data) => {
        this.languages = data;
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

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  onAuthorSelect(event) {
    this.addBookForm.get('authorFirstname').setValue('');
    this.addAuthor(this.selectedAuthors, event.option.value);
  }

  // redirecting method
  goToPage(pageName: string, id?: number) {
    this.router.navigate([`${pageName}/${id ? id : ''}`]);
  }

  getFormData(book: IBookPost): FormData {
    const formData = new FormData();
    Object.keys(book).forEach((key, index) => {
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

  onFileClear() {
    this.selectedFile = null;
  }

  async onCancel() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('Are you sure want to cancel?').toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.goToPage('/');
        }
      });
  }

  filterConfirmedAuthors() {
    return this.authors.filter((x) => x.isConfirmed === true);
  }

  isAuthorTyped(authorString: string): boolean {
    if (/(\s*[a-zA-Z]+\s+\w+(\s+|,|;)+)/g.test(authorString)) {
      return true;
    }
    return false;
  }

  parseAuthors(authorString: string) {
    const delim = /(\s+|,+|;+)/g;
    authorString = authorString.replace(delim, ' ').trim();

    const words: string[] = authorString.split(' ');
    const count = words.length;
    for (let i = 0; i < count / 2; i++) {
      if (words[0] && words[1]) {
        const author: IAuthor = {
          firstName: words[0] ? words[0] : null,
          lastName: words[1] ? words[1] : null,
          isConfirmed: false,
        };

        words.splice(0, 2);
        if (author.firstName && author.lastName) {
          this.selectedAuthors.push(author);
        }
      }
    }

    this.addBookForm.patchValue({ authorFirstname: '' });
  }

  changeAuthorInput() {
    if (this.withoutAuthorChecked) {
      this.addBookForm.get('authorFirstname').enable();
    } else {
      this.addBookForm.get('authorFirstname').disable();
    }
    this.withoutAuthorChecked = !this.withoutAuthorChecked;
    this.selectedAuthors = [];
    this.addBookForm.patchValue({ authorFirstname: '' });
  }

  // returns false if less than 2 words
  checkAuthorLastName(input: string): boolean {
    if (!input) {
      return true;
    }

    const delim = /(\s+|,+|;+)/g;
    input = input.replace(delim, ' ').trim();
    const words: string[] = input.split(' ');
    return words.length >= 2;
  }

  checkLength(element: HTMLElement, maxLength: number) {

    const input = (element as HTMLInputElement) != null ? (element as HTMLInputElement) : (element as HTMLTextAreaElement);

    if (input.value.length > maxLength) {
      const fieldName = input.attributes['formControlName'].value;
      input.value = input.value.substr(0, maxLength);

      this.addBookForm.controls[fieldName].setErrors({ maxlength: {requiredLength: maxLength}});
      this.addBookForm.controls[fieldName].markAsTouched();

      clearInterval(this.hideErrorInterval);
      this.hideErrorInterval = setTimeout(() => {
        this.addBookForm.controls[fieldName].setErrors(null);
        this.addBookForm.controls[fieldName].markAsTouched();
      }, 2000);
    }
  }
}
