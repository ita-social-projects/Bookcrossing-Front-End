import { RequestService } from 'src/app/core/services/request/request.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBook } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book/book.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BookQueryParams } from 'src/app/core/models/bookQueryParams';
import { SearchBarService } from 'src/app/core/services/searchBar/searchBar.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { IRequest } from 'src/app/core/models/request';
import { bookState } from 'src/app/core/models/bookState.enum';
import { RequestQueryParams } from 'src/app/core/models/requestQueryParams';
import { environment } from 'src/environments/environment';
import { booksPage } from 'src/app/core/models/booksPage.enum';
import { IBookPut } from '../../../core/models/bookPut';
import { FormGroup } from '@angular/forms';
import { WishListService } from 'src/app/core/services/wishlist/wishlist.service';
import {ILocationFilter} from '../../../core/models/books-map/location-filter';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit, OnDestroy {
  public isBlockView = false;
  public userId: number;
  public isRequester: boolean[] = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];

  tooltip = this.translate.instant('components.books.likeTooltip');
  public clickCounter = 0;
  public requestIds: object = {};
  public disabledButton = false;
  public books: IBook[];
  public totalSize: number;
  public booksPageName = 'common.books';
  public booksPage: booksPage = booksPage.List;
  public queryParams: BookQueryParams = new BookQueryParams();
  public apiUrl: string = environment.apiUrl;
  public selectedGenres: number[];
  public selectedStates: bookState[];
  public selectedLanguages: number[];
  public selectedLocations: ILocationFilter;
  public route = this.router.url;
  public constructor(
    protected routeActive: ActivatedRoute,
    protected router: Router,
    protected bookService: BookService,
    protected searchBarService: SearchBarService,
    protected authentication: AuthenticationService,
    protected dialogService: DialogService,
    protected translate: TranslateService,
    protected notificationService: NotificationService,
    protected requestService: RequestService,
    protected wishListService: WishListService
  ) {}

  public ngOnInit(): void {
    this.getUserId();
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 8);
      this.populateDataFromQuery();
      this.getBooks(this.queryParams);
    });
    this.router.events.subscribe((val) => {
      if (this.router.url !== '') {
        this.route = this.router.url;
      }
    });
    this.translate.get(this.booksPageName).subscribe(name => {
      this.booksPageName = name;
    });
  }

  public isAuthenticated(): boolean {
    return this.authentication.isAuthenticated();
  }

  public getUserId(): void {
    if (this.isAuthenticated()) {
      this.authentication.getUserId().subscribe((value: number) => {
        this.userId = value;
      });
    }
  }

  protected getUserWhoRequested(book: IBook, key: number): void {
    if (book.state === bookState.requested) {
      const query = new RequestQueryParams();
      query.first = false;
      query.last = true;
      this.requestService
        .getRequestForBook(book.id, query)
        .subscribe((value: IRequest) => {
          if (this.userId === value.user.id) {
            this.requestIds[book.id] = value.id;
            this.isRequester[key] = true;
          }
        });
    }
  }

  protected getWhichBooksWished(book: IBook): void {
    this.wishListService.isWished(book.id).subscribe((value: boolean) => {
      if (value) {
        book.isWished = true;
      }
    });
  }

  public async cancelRequest(bookId: number): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translate
          .get(
            'Do you want to cancel request? Current owner will be notified about your cancellation.'
          )
          .toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.disabledButton = true;
          this.requestService.deleteRequest(this.requestIds[bookId]).subscribe(
            () => {
              this.disabledButton = false;
              this.ngOnInit();
              this.notificationService.success(
                this.translate.instant('Request is cancelled.'),
                'X'
              );
            },
            (err) => {
              this.disabledButton = false;
              this.notificationService.error(
                this.translate.instant('Something went wrong!'),
                'X'
              );
            }
          );
        }
      });
  }

  public async requestBook(bookId: number): Promise<void> {
    if (!this.isAuthenticated()) {
      this.authentication.redirectToLogin();
    }

    const userHasValidLocation: boolean = await this.authentication.validateLocation();
    if (!userHasValidLocation) {
      return;
    }
    this.dialogService
      .openConfirmDialog(
        await this.translate
          .get(
            'Do you want to request this book? Current owner will be notified about your request.'
          )
          .toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.disabledButton = true;
          this.requestService.requestBook(bookId).subscribe(
            (value: IRequest) => {
              this.disabledButton = false;
              this.ngOnInit();
              this.notificationService.success(
                this.translate.instant(
                  'Book is successfully requested. Please contact with current owner to receive a book'
                ),
                'X'
              );
            },
            (err) => {
              this.disabledButton = false;
              this.notificationService.error(
                this.translate.instant('Something went wrong!'),
                'X'
              );
            }
          );
        }
      });
  }

  public onFilterChange(filterChanged: boolean): void {
    this.queryParams.genres = this.selectedGenres;
    this.queryParams.bookStates = this.selectedStates;
    this.queryParams.languages = this.selectedLanguages;
    this.queryParams.locations = this.selectedLocations?.locationIds?.length > 0
      ? this.selectedLocations.locationIds
      : undefined;
    this.queryParams.homeLocations = this.selectedLocations?.homeLocationIds?.length > 0
      ? this.selectedLocations.homeLocationIds
      : undefined;
    if (filterChanged) {
      this.resetPageIndex();
      this.changeUrl();
    }
  }

  private populateDataFromQuery(): void {
    if (this.queryParams.searchTerm) {
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm);
    }
    // if (typeof this.queryParams.showAvailable === 'undefined') {
    //   this.queryParams.showAvailable = true;
    // }
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

  // Navigation
  public pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  public hasLocation(value: bookState): boolean {
    return value?.toString() !== '4' && value.toString() !== '5';
  }

  private resetPageIndex(): void {
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
  }

  private changeUrl(): void {
    this.router.navigate(['.'], {
      relativeTo: this.routeActive,
      queryParams: this.queryParams,
    });
    this.getBooks(this.queryParams);
  }

  // get
  public getBooks(params: BookQueryParams): void {
    this.bookService.getBooksPage(params).subscribe({
      next: (pageData) => {
        this.books = pageData.page;
        if (this.isAuthenticated()) {
          for (let i = 0; i < pageData.page.length; i++) {
            this.getWhichBooksWished(pageData.page[i]);
            this.getUserWhoRequested(pageData.page[i], i);
          }
        }
        if (pageData.totalCount) {
          this.totalSize = pageData.totalCount;
        }
      },
      error: (err) => {
        this.notificationService.error(
          this.translate.instant('Something went wrong!'),
          'X'
        );
      },
    });
  }

  public ngOnDestroy(): void {
    this.searchBarService.changeSearchTerm(null);
  }

  public onViewModeChange(viewModeChanged: string): void {
    if (viewModeChanged === 'block') {
      this.isBlockView = true;
    } else {
      this.isBlockView = false;
    }
  }

  public changeWishList(book: IBook): void {
    this.clickCounter += 1;
    if (this.clickCounter <= 1) {
      if (book.isWished) {
        book.wishCount -= 1;
        this.wishListService.removeFromWishList(book.id).subscribe(
          (data) => {
            book.isWished = false;
            this.clickCounter = 0;
          },
          (error) => {
            this.clickCounter = 0;
            this.notificationService.error(
              this.translate.instant('Something went wrong'),
              'X'
            );
          }
        );
      } else {
        book.wishCount += 1;
        this.wishListService.addToWishList(book.id).subscribe(
          (data) => {
            book.isWished = true;
            this.clickCounter = 0;
          },
          (error) => {
            this.clickCounter = 0;
            this.notificationService.error(
              this.translate.instant('Cannot add own book to the wish list'),
              'X'
            );
          }
        );
      }
    }
  }

  public navigateToRequestFromCompany(): void {
    this.router.navigate(['requestfromcompany'], {
      queryParams: { searchTerm: this.queryParams.searchTerm}
    });
  }
  public isEn(): boolean {
    if (this.translate.currentLang === 'en') {
      return true;
    } else {
      return false;
    }
  }
}
