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
    private outerService: OuterServiceService,
    private activeroute: ActivatedRoute
  ) {}

  addBookForm: FormGroup;

  userId: number;
  genres: IGenre[] = [];
  selectedAuthors: IAuthor[] = [];
  authors: IAuthor[] = [];
  selectedFile: File = null;
  authorsSubscription: SubscriptionLike;
  submitted = false;
  submittedValid = false;
  authorFocused = false;
  newAuthor: IAuthor;
  withoutAuthorChecked = false;
  languages: ILanguage[] = [];
  outerBook: IOuterBook;
  selectedGenres = [];
  hideErrorInterval: NodeJS.Timeout;

  public ngOnInit(): void {
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
        () => {
          console.log('fetching userId error');
        }
      );
    }

    this.activeroute.queryParams.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      if (params['outerBookId']) {
        /* tslint:enable:no-string-literal */
        this.outerService
          /* tslint:disable:no-string-literal */
          .getBooksById(params['outerBookId'])
          /* tslint:enable:no-string-literal */
          .subscribe((outerBook) => {
            this.outerBook = outerBook;
            this.autoFill();
          });
      }
    });
  }

  public async autoFill(): Promise<void> {
    this.addBookForm.get('title').setValue(this.outerBook.title.substring(0, 150));
    this.addBookForm.get('publisher').setValue(this.outerBook.publisher.substring(0, 150));
    this.addBookForm.get('isbn').setValue(this.outerBook.isbn.substring(0, 17));
    this.addBookForm.get('description').setValue(this.outerBook.description.substring(0, 250));
    for (const author of this.outerBook.authors) {
      const field = (this.addBookForm.get('authorFirstname').value ?? '').substring(0, 20) + ' ' + author.fullName.substring(0, 20);
      this.addBookForm.get('authorFirstname').setValue(field);
    }
    fetch(this.outerBook.imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        this.selectedFile = new File(
          [blob],
          this.outerBook.imageUrl.substring(
            this.outerBook.imageUrl.lastIndexOf('/') + 1
          )
        );
      });
  }

  public setSearchTerm(searchTerm: string): void {
    /* tslint:disable:no-string-literal */
    this.router.navigate(['found-books'], {
      /* tslint:enable:no-string-literal */
      queryParams: { searchTerm },
    });
  }

  public isAuthenticated(): boolean {
    return this.authenticationService.isAuthenticated();
  }

  public filterAuthors(input: string): void {
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

  public buildForm(): void {
    this.addBookForm = new FormGroup({
      title: new FormControl('', Validators.required),
      genres: new FormControl(null, Validators.required),
      publisher: new FormControl(null),
      isbn: new FormControl(null),
      // authorLastname: new FormControl(null),
      authorFirstname: new FormControl(null),
      description: new FormControl(null),
      languageId: new FormControl(null, Validators.required),
      image: new FormControl(''),
    });
  }

  public async onSubmit(): Promise<void> {
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
    for (const genre of this.addBookForm.get('genres').value) {
      const id = genre;
      selectedGenres.push({ id, name, nameUk: this.getGenreById(id) });
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

    for (const newAuthor of newAuthors) {
      const author = await this.addNewAuthor(newAuthor);
      bookAuthors.push(author);
    }

    const book: IBookPost = {
      name: this.addBookForm.get('title').value,
      authors: bookAuthors,
      genres: selectedGenres,
      publisher: this.addBookForm.get('publisher').value,
      isbn: this.addBookForm.get('isbn').value,
      notice: this.addBookForm.get('description').value,
      state: bookState.available,
      userId: this.userId,
      languageId: this.addBookForm.get('languageId').value,
      image: this.addBookForm.get('image').value,
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
  public validateForm(form: FormGroup): boolean {
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

  public async addNewAuthor(newAuthor): Promise<IAuthor> {
    const author = await this.authorService.addAuthor(newAuthor).toPromise();
    return author;
  }

  public addAuthor(authors, author: IAuthor): void {
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


  public getGenreById(id: number) {
    if (this.isEn()) {
      return this.genres ? this.genres.find((genre) => genre.id === id)?.name : '';
    } else {
      return this.genres ? this.genres.find((genre) => genre.id === id)?.nameUk : '';
    }
  }

  getAllGenres() {
    this.genreService.getGenre().subscribe(
      (data) => {
        if (this.translate.currentLang === 'en') {
        this.genres = data.sort((a, b) => (a.name > b.name) ? 1 : -1);
        } else {
          this.genres = data.sort((a, b) => (a.nameUk > b.nameUk) ? 1 : -1);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCategoriesLanguage() {
    if (this.translate.currentLang === 'en') {
      this.genres.sort((a, b) => (a.name > b.name) ? 1 : -1);
      return true;
    } else {
      this.genres.sort((a, b) => (a.nameUk > b.nameUk) ? 1 : -1);
      return false;
    }
  }

  public getAllLanguages(): void {
    this.bookLanguageService.getLanguage().subscribe(
      (data) => {
        this.languages = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public onDeleteAuthor(author: IAuthor): void {
    const index = this.selectedAuthors.indexOf(author);
    if (index > -1) {
      this.selectedAuthors.splice(index, 1);
    }
  }

  public onFileSelected(event): void {
    const fileName = event.target.files[0].name;
    const idxDot = fileName.lastIndexOf('.') + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
      this.selectedFile = event.target.files[0];
    } else {
      this.notificationService.info(
        this.translate.instant('common-errors.file-type-error'),
        'X'
      );
    }
  }

  public onAuthorSelect(event): void {
    this.addBookForm.get('authorFirstname').setValue('');
    this.addAuthor(this.selectedAuthors, event.option.value);
  }

  // redirecting method
  public goToPage(pageName: string, id?: number): void {
    this.router.navigate([`${pageName}/${id ? id : ''}`]);
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

  public onFileClear(): void {
    this.selectedFile = null;
    this.addBookForm.get('image').setValue('');
  }

  public isFilled(): boolean {
    if (this.addBookForm.get('title').value !== '' ||
    this.addBookForm.get('image').value !== '') {
       return true;
      } else {
      return false;
    }
  }

  public async onCancel(): Promise<void> {
    if (this.isFilled()) {
    this.submittedValid = true;
    this.dialogService
      .openConfirmDialog(
        await this.translate.get(this.translate.instant('components.profile.edit.cancelDialog')).toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.goToPage('/');
        }
      });
    } else {
    this.goToPage('/');
    }
  }

  public filterConfirmedAuthors(): IAuthor[] {
    return this.authors.filter((x) => x.isConfirmed === true);
  }

  public isAuthorTyped(authorString: string): boolean {
    if (/(\s*[а-яА-Яa-zA-Z0-9]+\s+\w+(\s+|,|;)+)/g.test(authorString)) {
      return true;
    }
    return false;
  }

  public parseAuthors(authorString: string): void {
    const delim = /(\s+|,+|;+)/g;
    authorString = authorString.replace(delim, ' ').trim();

    const words: string[] = authorString.split(' ');
    const count = words.length;
    if (words[0].length > 20 || words[1].length > 20) {
      this.addBookForm.get('authorFirstname').errors.pattern = true;
    } else {
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
  }

  public changeAuthorInput(): void {
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
  public checkAuthorLastName(input: string): boolean {
    if (!input) {
      return true;
    }

    const delim = /(\s+|,+|;+)/g;
    input = input.replace(delim, ' ').trim();
    const words: string[] = input.split(' ');
    return words.length >= 2 || words.length <= 20;
  }

  public checkLength(element: HTMLElement, maxLength: number): void {
    const input =
      (element as HTMLInputElement) != null
        ? (element as HTMLInputElement)
        : (element as HTMLTextAreaElement);

    if (input.value.length > maxLength) {
      /* tslint:disable:no-string-literal */
      const fieldName = input.attributes['formControlName']?.value;
      /* tslint:enable:no-string-literal */
      input.value = input.value.substr(0, maxLength);

      this.addBookForm.controls[fieldName]?.setErrors({
        maxlength: { requiredLength: maxLength },
      });
      this.addBookForm.controls[fieldName]?.markAsTouched();

      clearInterval(this.hideErrorInterval);
      this.hideErrorInterval = setTimeout(() => {
        this.addBookForm.controls[fieldName]?.setErrors(null);
        this.addBookForm.controls[fieldName]?.markAsTouched();
      }, 2000);
    }
  }

  public isEn(): boolean {
    return this.translate.currentLang === 'en';
  }
}
