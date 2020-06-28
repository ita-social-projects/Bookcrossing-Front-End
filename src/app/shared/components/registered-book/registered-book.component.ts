import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBook} from 'src/app/core/models/book';
import {BookService} from 'src/app/core/services/book/book.service';
import {AuthenticationService} from 'src/app/core/services/authentication/authentication.service';
import {DialogService} from 'src/app/core/services/dialog/dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from 'src/app/core/services/notification/notification.service';
import {RequestService} from 'src/app/core/services/request/request.service';
import {IRequest} from 'src/app/core/models/request';
import {BookQueryParams} from '../../../core/models/bookQueryParams';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SearchBarService} from '../../../core/services/searchBar/searchBar.service';
import {environment} from 'src/environments/environment';
import {booksPage} from '../../../core/models/booksPage.enum';
import {bookState} from '../../../core/models/bookState.enum';
import {RequestQueryParams} from '../../../core/models/requestQueryParams';

@Component({
  selector: 'app-registered-book',
  templateUrl: '../books/books.component.html',
  styleUrls: ['../books/books.component.scss']
})

export class RegisteredBookComponent implements OnInit, OnDestroy {

  isBlockView: boolean = false;
  userId: number;
  isRequester: boolean[] = [undefined, undefined, undefined, undefined, undefined ,undefined, undefined, undefined];
  requestIds: Object = {};
  disabledButton: boolean = false;
  books: IBook[];
  totalSize: number;
  booksPage: booksPage = booksPage.registered;
  queryParams: BookQueryParams = new BookQueryParams;
  selectedGenres: number[];
  selectedLanguages: number[];
  apiUrl: string = environment.apiUrl;
  route = this.router.url;

  constructor(private bookService: BookService,
              private routeActive: ActivatedRoute,
              private router: Router,
              private authentication: AuthenticationService,
              private dialogService: DialogService,
              private translate: TranslateService,
              private searchBarService: SearchBarService,
              private notificationService: NotificationService,
              private requestService: RequestService) { }

  ngOnInit(): void {
    this.getUserId()
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 8);
      this.populateDataFromQuery();
      this.getBooks(this.queryParams);
    });
    this.router.events.subscribe((val) => {
      if( this.router.url != ''){
        this.route =  this.router.url;
      } 
    });
  }

  getUserId(){
    if (this.isAuthenticated()) {
      this.authentication.getUserId().subscribe((value: number) => {
        this.userId = value;
      });
    }
  }

  getUserWhoRequested(book: IBook, key: number) {
    if (book.state === bookState.requested) {
      const query = new RequestQueryParams();
      query.first = false;
      query.last = true;
      this.requestService.getRequestForBook(book.id, query).subscribe((value: IRequest) => {
        if (this.userId === value.user.id) {
          this.requestIds[book.id] = value.id
          this.isRequester[key] = true;
        }
      });
    }
  }

  async cancelRequest(bookId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to cancel request? Current owner will be notified about your cancellation.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.disabledButton = true;
          this.requestService.deleteRequest(bookId).subscribe(() => {
            this.disabledButton = false;
            this.ngOnInit();
            this.notificationService.success(this.translate
              .instant("Request is cancelled."), "X");
          }, err => {
            this.disabledButton = false;
            this.notificationService.error(this.translate
              .instant("Something went wrong!"), "X");
          });
        }
      });
  }

  isAuthenticated(){
    return this.authentication.isAuthenticated();
  }

  async requestBook(bookId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to request this book? Current owner will be notified about your request.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        this.disabledButton = true;
        if (res) {
          this.requestService.requestBook(this.requestIds[bookId]).subscribe((value: IRequest) => {
            this.disabledButton = false;
            this.ngOnInit();
            this.notificationService.success(this.translate
              .instant("Book is successfully requested. Please contact with current owner to receive a book"), "X");
            }, err => {
            this.disabledButton = false;
              this.notificationService.error(this.translate
                .instant("Something went wrong!"), "X");
            });
        }
      });
    }

  onFilterChange(filterChanged: boolean) {
    this.queryParams.genres = this.selectedGenres;
    this.queryParams.languages = this.selectedLanguages;
    if (filterChanged) {
      this.resetPageIndex();
      this.changeUrl();
    }
  }
  private populateDataFromQuery() {
    if (this.queryParams.searchTerm) {
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm);
    }
    if (typeof this.queryParams.showAvailable === 'undefined') {
      this.queryParams.showAvailable = false;
    }
    if (this.queryParams.genres) {
      let genres: number[];
      if (Array.isArray(this.queryParams.genres)) {
        genres = this.queryParams.genres.map(v => +v);
      } else {
        genres = [+this.queryParams.genres];
      }
      this.selectedGenres =  genres;
    }
    if (this.queryParams.languages) {
      let languages: number[];
      if (Array.isArray(this.queryParams.languages)) {
        languages = this.queryParams.languages.map(v => +v);
      } else {
        languages = [+this.queryParams.languages];
      }
      this.selectedLanguages =  languages;
    }
  }

  // Navigation
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
    window.scrollTo({
      top: 0,
      behavior:'smooth'
    });
  }
  private resetPageIndex() : void {
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
  }
  private changeUrl(): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.queryParams,
      });
  }


  //get
  getBooks(params: BookQueryParams): void {
    this.bookService.getRegisteredBooks(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          for(var i = 0; i<pageData.page.length; i++){

            this.getUserWhoRequested(pageData.page[i], i)
          }
          if (pageData.totalCount) {
            this.totalSize = pageData.totalCount;
          }
        },
        error: err => {
          this.notificationService.error(this.translate
            .instant("Something went wrong!"), "X");
        }
      });
  };

  ngOnDestroy() {
    this.searchBarService.changeSearchTerm(null);
  }
  onViewModeChange(viewModeChanged: string) {
    if(viewModeChanged === 'block'){
      this.isBlockView = true;
    }
    else {
      this.isBlockView = false;
    }
  }
}
