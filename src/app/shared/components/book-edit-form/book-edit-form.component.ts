import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IAuthor} from 'src/app/core/models/author';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BookService} from 'src/app/core/services/book/book.service';
import {IBook} from 'src/app/core/models/book';
import {Router} from '@angular/router';
import {AuthenticationService} from 'src/app/core/services/authentication/authentication.service';
import {AuthorService} from 'src/app/core/services/author/authors.service';
import {GenreService} from 'src/app/core/services/genre/genre';
import {IGenre} from 'src/app/core/models/genre';
import {SubscriptionLike} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from 'src/app/core/services/notification/notification.service';
import {DialogService} from 'src/app/core/services/dialog/dialog.service';
import {IBookPut} from 'src/app/core/models/bookPut';
import {bookState} from '../../../core/models/bookState.enum';
import {ILanguage} from '../../../core/models/language';
import {BookLanguageService} from '../../../core/services/bookLanguage/bookLanguage.service';

@Component({
  selector: 'app-author-form',
  templateUrl: './book-edit-form.component.html',
  styleUrls: ['./book-edit-form.component.scss']
})
export class BookEditFormComponent implements OnInit {

@Output() cancel: EventEmitter<void> = new EventEmitter<void>();
@Input() book: IBook;
@Input() isAdmin: boolean;

editBookForm: FormGroup;

  userId: number;
  isInActive = false;
  genres: IGenre[] = [];
  selectedAuthors: IAuthor[] = [];
  authors: IAuthor[] = [];
  selectedFile = null;
  authorsSubscription: SubscriptionLike;
  submitted = false;
  authorFocused = false;
  withoutAuthorChecked = false;
  newAuthor: IAuthor;
  selectedGenres = [];
  languages: ILanguage[] = [];
  hideErrorInterval: NodeJS.Timeout;

constructor(
  private translate: TranslateService,
  private notificationService: NotificationService,
  private dialogService: DialogService,
  private bookService: BookService,
  private genreService: GenreService,
  private authorService: AuthorService,
  private authenticationService: AuthenticationService,
  private router: Router,
  private bookLanguageService: BookLanguageService
) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAllGenres();
    this.getAllLanguages();
    this.authorsSubscription = this.editBookForm
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
      title: new FormControl({value: this.book.name, disabled: false}, Validators.required),
      genres: new FormControl(null, Validators.required),
      publisher: new FormControl({value: this.book.publisher, disabled: false}),
      isbn: new FormControl({value: this.book.isbn, disabled: false}),
      authorFirstname: new FormControl(null),
      description: new FormControl({value: this.book.notice, disabled: false}),
      image: new FormControl({value: this.book.imagePath, disabled: false}),
      inactive: new FormControl(false),
      languageId: new FormControl({value: this.book.language.id, disabled: false})
    });
    if (this.book.state === bookState.inActive) {
      this.isInActive = true;
    }
    if (this.book.authors) {
      this.book.authors.forEach(element => {
        this.addAuthor(this.selectedAuthors, element);
      });
    }
    if (this.book.genres) {
      this.book.genres.forEach(element => {
        this.selectedGenres.push(element.id);
      });
    }
  }

  isFileExists() {
    if (this.book.imagePath) {
      if (!this.selectedFile) {
        return true;
      }
    }
  }

  async onSubmit() {

    this.submitted = true;

    if (this.validateForm(this.editBookForm)) {
      return;
    }
    // parse selected genres
    const selectedGenres: IGenre[] = [];
    for (const genre of this.editBookForm.get('genres').value) {
      const id = genre;
      selectedGenres.push({ id, name, nameUk: this.getGenreById(id) });
    }
    let bookAuthors: IAuthor[];

    if (this.editBookForm.get('authorFirstname').value !== null) {
      const authorInput = this.editBookForm.get('authorFirstname').value.trim();
      if (authorInput) {
        this.parseAuthors(authorInput);
        this.newAuthor = undefined;
      }

      bookAuthors = this.selectedAuthors
        .slice()
        .filter((x) => x.isConfirmed === true);
      const newAuthors = this.selectedAuthors.filter(
        (x) => x.isConfirmed === false
      );

      for (const newAuthor of newAuthors) {
        const author = await this.addNewAuthor(newAuthor);
        bookAuthors.push(author);
      }
    } else {
      bookAuthors = this.selectedAuthors;
    }

    const book: IBookPut = {
      id: this.book.id,
      fieldMasks: []
    };
    if (JSON.stringify(selectedGenres) !== JSON.stringify(this.book.genres)) {
      book.fieldMasks.push('BookGenre');
      book.bookGenre = selectedGenres;
    }
    if (!this.withoutAuthorChecked) {
      if (JSON.stringify(bookAuthors) !== JSON.stringify(this.book.authors)) {
        book.fieldMasks.push('BookAuthor');
        book.bookAuthor = bookAuthors;
      }
    } else {
      book.fieldMasks.push('BookAuthor');
      book.bookAuthor = [];
    }
    if (this.editBookForm.get('title').value !== this.book.name) {
      book.fieldMasks.push('Name');
      book.name = this.editBookForm.get('title').value;
    }
    if (this.editBookForm.get('publisher').value !== this.book.publisher) {
      book.fieldMasks.push('Publisher');
      book.publisher = this.editBookForm.get('publisher').value;
    }
    if (this.editBookForm.get('isbn').value !== this.book.isbn) {
      book.fieldMasks.push('ISBN');
      book.isbn = this.editBookForm.get('isbn').value;
    }
    if (this.editBookForm.get('description').value !== this.book.notice) {
      book.fieldMasks.push('Notice');
      book.notice = this.editBookForm.get('description').value;
    }
    if (this.editBookForm.get('languageId').value !== this.book.language.id) {
      book.fieldMasks.push('LanguageId');
      book.languageId = this.editBookForm.get('languageId').value;
    }
    if (this.selectedFile) {
      book.fieldMasks.push('Image');
      book.image = this.selectedFile;
    }
    if (book.fieldMasks.length < 1) {
      this.chengeInActiveIfNeed();
      this.cancel.emit();
    } else {
      const formData: FormData = this.getFormData(book);
      this.bookService.putBook(book.id, formData).subscribe(
        () => {
          this.chengeInActiveIfNeed();
          this.notificationService.success(this.translate.instant('Book is edited successfully'), 'X');
          this.cancel.emit();
        },
        (error) => {
          this.notificationService.error(this.translate.instant('Please edit something!'), 'X');
        }
      );
    }

    // after submit subscription stops work
    this.authorsSubscription.unsubscribe();
    this.authorsSubscription = this.editBookForm
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
  chengeInActiveIfNeed() {
    if (this.editBookForm.get('inactive').value !== this.isInActive) {
      switch (this.book.state) {
        case bookState.inActive:
          this.bookService.activateBook(this.book.id).subscribe(() => {
            this.cancel.emit();
            this.notificationService.success(this.translate.instant('Book is edited successfully'), 'X');
          });
          break;
        default: this.bookService.deactivateBook(this.book.id).subscribe(() => {
          this.cancel.emit();
          this.notificationService.success(this.translate.instant('Book is edited successfully'), 'X');
        });
                 break;
      }
    }
  }
  validateForm(form: FormGroup): boolean {
    if (!this.userId) {
      this.notificationService.error(
        this.translate.instant('You have to be logged in to edit book'),
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

  getGenreById(id: number) {
    if (this.isEn() ) {
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

  // parses string and returns IAuthor object
  parseAuthorString(input: string): IAuthor {
    input = input.trim();
    const words = input.split(/\s+/g);
    const firstName = words[0];
    let lastName = null;

    // if input string contains > 3 words - second is middleName
    if (words.length > 1) {
      lastName = words[words.length - 1];
    }
    const author: IAuthor = {
      firstName,
      lastName,
      isConfirmed: false
    };
    return author;
  }

  onAuthorSelect(event) {
    this.editBookForm.get('authorFirstname').setValue('');
    this.addAuthor(this.selectedAuthors, event.option.value);
  }

  getFormData(book: IBookPut): FormData {
    const formData = new FormData();
    Object.keys(book).forEach((key, _) => {
      if (book[key]) {
        if (Array.isArray(book[key])) {
          book[key].forEach((i, index) => {
            if (key === 'fieldMasks') {
              formData.append(`${key}[${index}]`, book[key][index]);
            } else {
            formData.append(`${key}[${index}][id]`, book[key][index].id);
            }
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
  filterConfirmedAuthors() {
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
       this.editBookForm.get('authorFirstname').errors.pattern = true;
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

      this.editBookForm.patchValue({ authorFirstname: '' });
    }
  }

  changeAuthorInput() {
    if (this.withoutAuthorChecked) {
      this.editBookForm.get('authorFirstname').enable();
    } else {
      this.editBookForm.get('authorFirstname').disable();
    }
    this.withoutAuthorChecked = !this.withoutAuthorChecked;
    this.selectedAuthors = [];
    this.editBookForm.patchValue({ authorFirstname: ' ' });
  }

  // returns false if less than 2 words
  checkAuthorLastName(input: string): boolean {
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

      this.editBookForm.controls[fieldName]?.setErrors({
        maxlength: { requiredLength: maxLength },
      });
      this.editBookForm.controls[fieldName]?.markAsTouched();
      clearInterval(this.hideErrorInterval);
      this.hideErrorInterval = setTimeout(() => {
        this.editBookForm.controls[fieldName]?.setErrors(null);
        this.editBookForm.controls[fieldName]?.markAsTouched();
      }, 2000);
    }
  }

  public isChanged(): boolean {
    if (this.editBookForm.get('title').value !== this.book.name ||
    this.editBookForm.get('publisher').value !== this.book.publisher ||
    this.editBookForm.get('isbn').value !== this.book.isbn ||
    this.editBookForm.get('description').value !== this.book.notice ||
    this.editBookForm.get('languageId').value !== this.book.language.id) {
      return true;
    } else {
      return false;
    }
  }


  public async onCancel(): Promise<void> {
    if (this.isChanged()) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get(this.translate.instant('components.profile.edit.cancelDialog')).toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.cancel.emit();
        }
      });
    } else {
      this.cancel.emit();
    }
  }
  public isEn(): boolean {
    return this.translate.currentLang === 'en';
  }
}
