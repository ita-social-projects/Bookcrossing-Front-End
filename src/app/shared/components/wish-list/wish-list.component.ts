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

@Component({
  selector: 'app-books',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishListComponent implements OnInit, OnDestroy {
  isBlockView = false;
  userId: number;
  isRequester: boolean[] = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  public requestIds: object = {};
  public disabledButton = false;
  public books: IBook[];
  public totalSize: number;
  public booksPageName = 'common.wishlist';
  public booksPage: booksPage = booksPage.WishList;
  public queryParams: BookQueryParams = new BookQueryParams();
  public apiUrl: string = environment.apiUrl;
  public route = this.router.url;
  public processedBookIds: Array<number> = new Array();

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private searchBarService: SearchBarService,
    private authentication: AuthenticationService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private requestService: RequestService,
    private wishListService: WishListService
  ) {}

  public ngOnInit(): void {
    this.getUserId();
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 8);
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

  public hasLocation(value: bookState): boolean {
    return value?.toString() !== '4' && value.toString() !== '5';
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

  public getUserWhoRequested(book: IBook, key: number): void {
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
    const userHasValidLocation: boolean = await this.authentication.validateLocation();
    if (!userHasValidLocation) { return; }
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
            () => {
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

  // Navigation
  public pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
  }

  private changeUrl(): void {
    this.router.navigate(['.'], {
      relativeTo: this.routeActive,
      queryParams: this.queryParams,
    });
  }

  // get

  private getBooks(params: BookQueryParams): void {
    this.wishListService.getWishList(params).subscribe({
      next: (pageData) => {
        this.books = pageData.page;
        if (this.isAuthenticated()) {
          for (let i = 0; i < pageData.page.length; i++) {
            this.getUserWhoRequested(pageData.page[i], i);
          }
        }
        if (pageData.totalCount) {
          this.totalSize = pageData.totalCount;
        }
      },
      error: () => {
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

  private removeBookIdFromProcessing(bookId: number) {
    const index = this.processedBookIds.indexOf(bookId, 0);
    if (index > -1) {
      this.processedBookIds.splice(index, 1);
    }
  }

  public removeFromWishList(bookId: number): void {
   if ( this.processedBookIds.includes(bookId)) {
     return;
   }
    this.processedBookIds.push(bookId);
    this.wishListService.removeFromWishList(bookId).subscribe(
      (data) => {        
        this.routeActive.queryParams.subscribe((params: Params) => {
          this.queryParams = BookQueryParams.mapFromQuery(params, 1, 8);
          this.getBooks(this.queryParams);
          this.pageChanged(this.queryParams.page);
          this.removeBookIdFromProcessing(bookId);          
        });
      },
      () => {        
        this.removeBookIdFromProcessing(bookId);        
        this.notificationService.error(
          this.translate.instant('Something went wrong'),
          'X'
        );
      }
    );
  }
}
