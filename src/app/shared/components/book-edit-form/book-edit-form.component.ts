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

@Component({
  selector: 'app-author-form',
  templateUrl: './book-edit-form.component.html',
  styleUrls: ['./book-edit-form.component.scss']
})
export class BookEditFormComponent implements OnInit {

@ViewChild("lastnameInput") inputLastname;
@Output() onCancel : EventEmitter<void> = new EventEmitter<void>()
@Input() book : IBook
@Input() isAdmin: boolean

editBookForm: FormGroup;

  userId: number;
  isInActive: boolean = false;
  genres: IGenre[] = [];
  selectedAuthors: IAuthor[] = [];
  authors: IAuthor[] = [];
  selectedFile = null;
  authorsSubscription: SubscriptionLike;
  submitted = false;
  authorFocused: boolean = false;
  lastnameInputVisible: boolean = false;
  newAuthor: IAuthor;
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
      .get('authorFirstname')
      .valueChanges.subscribe((input) => {
        this.filterAuthors(input);
      });
      if (this.isAuthenticated()) {
        this.authenticationService.getUserId().subscribe(
          (response: number) => {
            this.userId = response;
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
      authorLastname: new FormControl(null),
      authorFirstname: new FormControl(null),
      description: new FormControl({value:this.book.notice, disabled: false}),
      image: new FormControl({value:this.book.imagePath, disabled: false}),
      inactive: new FormControl(null)
    });
    if(this.book.state === bookState.inActive){
      this.isInActive = true;
    }
    if(this.book.authors){
      this.book.authors.forEach(element => {
        this.addAuthor(this.selectedAuthors, element);
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

  async onSubmit() {

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

    const bookAuthors: IAuthor[] = this.selectedAuthors.slice();
    if(this.editBookForm.get("authorFirstname").value){
      if (this.editBookForm.get("authorFirstname").value.trim()) {
        await this.addNewAuthor();
        bookAuthors.push(this.newAuthor);
        this.newAuthor = undefined;
      }
    }
    let book: IBookPut = {
      id: this.book.id,
      fieldMasks: []
    };
    if(JSON.stringify(selectedGenres) !== JSON.stringify(this.book.genres)){
      book.fieldMasks.push("BookGenre");
      book.bookGenre = selectedGenres;
    }
    if(JSON.stringify(bookAuthors) !== JSON.stringify(this.book.authors)){
      book.fieldMasks.push("BookAuthor");
      book.bookAuthor = bookAuthors;
    }
    if(this.editBookForm.get('title').value !== this.book.name){
      book.fieldMasks.push("Name");
      book.name = this.editBookForm.get('title').value;
    }
    if(this.editBookForm.get('publisher').value !== this.book.publisher){
      book.fieldMasks.push("Publisher");
      book.publisher = this.editBookForm.get('publisher').value;
    }
    if(this.editBookForm.get('description').value !== this.book.notice){
      book.fieldMasks.push("Notice");
      book.notice = this.editBookForm.get('description').value;
    }
    if (this.selectedFile) {
      book.fieldMasks.push("Image");
      book.image = this.selectedFile;
    }
    if(book.fieldMasks.length < 1){
      this.chengeInActiveIfNeed()
      this.cancel()
    }
    else {
      const formData: FormData = this.getFormData(book);
      this.bookService.putBook(book.id, formData).subscribe(
        (data: boolean) => {
          this.chengeInActiveIfNeed()
          this.notificationService.success(this.translate.instant("Book is edited successfully"), "X");
          this.onCancel.emit();
        },
        (error) => {
          this.notificationService.error(this.translate.instant("Please edit something!"), "X");
        }
      );
    }

    // after submmit subscription stops work
    this.authorsSubscription.unsubscribe();
    this.authorsSubscription = this.editBookForm
      .get('authorFirstname')
      .valueChanges.subscribe((input) => {
        this.filterAuthors(input);
      });
  }
  chengeInActiveIfNeed(){
    if(this.editBookForm.get('inactive').value !== this.isInActive){
      switch(this.book.state) {
        case bookState.inActive:
          this.bookService.activateBook(this.book.id).subscribe(() => {
            this.onCancel.emit();
            this.notificationService.success(this.translate.instant("Book is edited successfully"), "X");
          })
          break
        default: this.bookService.deactivateBook(this.book.id).subscribe(() => {
          this.onCancel.emit();
          this.notificationService.success(this.translate.instant("Book is edited successfully"), "X");
        })
          break
      }
    }
  }
  validateForm(form: FormGroup): boolean {
    if (!this.userId) {
      this.notificationService.error(
        this.translate.instant("You have to be logged in to edit book"),
        "X"
      );
      return true;
    } else if (
      (!form.get("authorFirstname").value?.trim() || !form.get("authorLastname").value?.trim()) &&
      !this.selectedAuthors.length
    ) {
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


  async addNewAuthor() {
    // let author: IAuthor;
    let newAuthor: IAuthor = {
      firstName: this.editBookForm.get("authorFirstname").value,
      lastName: this.editBookForm.get("authorLastname").value
        ? this.editBookForm.get("authorLastname").value
        : "",
      isConfirmed: false,
    };
    this.newAuthor = await this.authorService.addAuthor(newAuthor).toPromise();
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

    // if input string contains > 3 words - second is middleName
    if (words.length > 1) {
      lastName = words[words.length - 1];
    }
    const author: IAuthor = {
      firstName: firstName,
      lastName: lastName,
      isConfirmed: false
    };
    console.log(author);
    return author;
  }

  onAuthorSelect(event) {
    this.editBookForm.get("authorFirstname").setValue("");
    this.addAuthor(this.selectedAuthors, event.option.value);
  }

  getFormData(book: IBookPut): FormData {
    const formData = new FormData();
    Object.keys(book).forEach((key, index) => {
      if (book[key]) {
        if (Array.isArray(book[key])) {
          book[key].forEach((i, index) => {
            if(key == "fieldMasks"){
              formData.append(`${key}[${index}]`, book[key][index]);
            }
            else{
            formData.append(`${key}[${index}][id]`, book[key][index]['id']);
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
  cancel() {
    this.onCancel.emit();
  }
  filterConfirmedAuthors() {
    return this.authors.filter((x) => x.isConfirmed === true);
  }
  onPressSpace() {
    this.lastnameInputVisible = true;
    setTimeout(() => {
      this.authorFocused = false;
      this.inputLastname.nativeElement.focus();
    }, 0);
  }
}
