import {Component, OnInit} from '@angular/core';
import {IRequest} from 'src/app/core/models/request';
import {BookService} from 'src/app/core/services/book/book.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NotificationService} from '../../../core/services/notification/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {RequestService} from 'src/app/core/services/request/request.service';
import {DialogService} from 'src/app/core/services/dialog/dialog.service';
import {BookQueryParams} from 'src/app/core/models/bookQueryParams';
import {SearchBarService} from 'src/app/core/services/searchBar/searchBar.service';
import {environment} from 'src/environments/environment';
import {IBook} from '../../../core/models/book';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';
import { booksPage } from 'src/app/core/models/booksPage.enum';
import { WishListService } from 'src/app/core/services/wishlist/wishlist.service';
import {ILocationFilter} from '../../../core/models/books-map/location-filter';
import { bookState } from 'src/app/core/models/bookState.enum';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  providers: []
})
export class RequestsComponent implements OnInit {

  isBlockView = false;
  userId: number;
  isRequester: boolean[] = [true, true, true, true, true , true, true, true];
  disabledButton = false;
  viewMode: string;
  requests: IRequest[];
  booksPageName = 'common.requested';
  booksPage: booksPage = booksPage.Requested;
  books: IBook[];
  totalSize: number;
  queryParams: BookQueryParams = new BookQueryParams();
  selectedGenres: number[];
  selectedLanguages: number[];
  selectedLocations: ILocationFilter;
  selectedStates: bookState[];
  apiUrl: string = environment.apiUrl;
  route = this.router.url;

  filter: string;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private routeActive: ActivatedRoute,
    private requestService: RequestService,
    private searchBarService: SearchBarService,
    private router: Router,
    private dialogService: DialogService,
    private authentication: AuthenticationService,
    private wishListService: WishListService,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params);
      this.populateDataFromQuery();
      this.getUserRequests(this.queryParams);
    });
    this.router.events.subscribe((val) => {
      if (this.router.url !== '') {
        this.route = this.router.url;
      }
    });
    this.translate.get(this.booksPageName).subscribe((name) => {
      this.booksPageName = name;
    });
  }

  isAuthenticated() {
    return this.authentication.isAuthenticated();
  }

  getUserRequests(params: BookQueryParams): void {
    this.requestService.getUserRequestsPage(params)
    .subscribe( {
      next: pageData => {
        this.requests = pageData.page;
        const books = [];
        pageData.page.forEach((item: IRequest) => {
          books.push(item.book);
        });
        this.books = books;
        for (const book of this.books) {
          this.getWhichBooksWished(book);
        }
        if (pageData.totalCount) {
        this.totalSize = pageData.totalCount;
      }
    }
   });
  }

  getWhichBooksWished(book: IBook) {
    this.wishListService.isWished(book.id).subscribe((value: boolean) => {
      if (value) { book.isWished = true; }
    });
  }

  async cancelRequest(bookId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('components.books.confirmation.cancel-request').toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.disabledButton = true;
          const request = this.requests.find(x => x.book.id === bookId);
          this.requestService.deleteRequest(request.id).subscribe(() => {
            this.disabledButton = false;
            this.ngOnInit();
            this.notificationService.success(this.translate
                .instant('components.books.message.request-canceled'), 'X');
            }, err => {
            this.disabledButton = false;
            this.notificationService.error(this.translate
                .instant('components.common-errors.error-message'), 'X');
            });
        }
      });
  }

  private compareArrays(first: any, second: any): boolean {
    return JSON.stringify(first) === JSON.stringify(second);
  }

  onFilterChange(filterChanged: boolean) {
    if (filterChanged === false) {
      filterChanged =
        !this.compareArrays(this.queryParams.genres, this.selectedGenres) ||
        !this.compareArrays(this.queryParams.bookStates, this.selectedStates) ||
        !this.compareArrays(
          this.queryParams.languages,
          this.selectedLanguages
        ) ||
        !this.compareArrays(
          this.queryParams.locations,
          this.selectedLocations.locationIds
        ) ||
        !this.compareArrays(
          this.queryParams.homeLocations,
          this.selectedLocations.homeLocationIds
        );
    }
    this.queryParams.genres = this.selectedGenres;
    this.queryParams.bookStates = this.selectedStates;
    this.queryParams.languages = this.selectedLanguages;
    this.queryParams.locations =
      this.selectedLocations?.locationIds?.length > 0
        ? this.selectedLocations.locationIds
        : undefined;
    this.queryParams.homeLocations =
      this.selectedLocations?.homeLocationIds?.length > 0
        ? this.selectedLocations.homeLocationIds
        : undefined;
    if (filterChanged) {
      this.resetPageIndex();
      this.changeUrl();
    }
  }

  async requestBook(bookId: number) {}

  private populateDataFromQuery() {
    if (this.queryParams.searchTerm) {
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm);
    }

    if (this.queryParams.bookStates) {
      let stateEl: bookState[];
      if (Array.isArray(this.queryParams.bookStates)) {
        stateEl = this.queryParams.bookStates.map((s) => s);
      } else {
        stateEl = [];
      }
      this.selectedStates = stateEl;
    }

    if (this.queryParams.genres) {
      let genres: number[];
      if (Array.isArray(this.queryParams.genres)) {
        genres = this.queryParams.genres.map((v) => +v);
      } else {
        genres = [+this.queryParams.genres];
      }
      this.selectedGenres = genres;
    }

    if (this.queryParams.languages) {
      let languages: number[];
      if (Array.isArray(this.queryParams.languages)) {
        languages = this.queryParams.languages.map((v) => +v);
      } else {
        languages = [+this.queryParams.languages];
      }
      this.selectedLanguages = languages;
    }
  }

  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  private resetPageIndex(): void {
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
  }
  private changeUrl(): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.queryParams,
      });
    this.getUserRequests(this.queryParams);
  }
  onViewModeChange(viewModeChanged: string) {
    if (viewModeChanged === 'block') {
      this.isBlockView = true;
    } else {
      this.isBlockView = false;
    }
  }

  changeWishList(book: IBook): void {
      if (book.isWished) {
        this.wishListService.removeFromWishList(book.id).subscribe(
          (data) => { book.isWished = false; },
          (error) => {
            this.notificationService.error(
              this.translate.instant('Something went wrong'),
              'X'
            );
          }
        );
      } else {
        this.wishListService.addToWishList(book.id).subscribe(
        (data) => { book.isWished = true; },
          (error) => {
            this.notificationService.error(
              this.translate.instant('Cannot add own book to the wish list'),
              'X'
            );
          }
        );
      }
  }


  public isEn(): boolean {
    return this.translate.currentLang === 'en';
  }
}
