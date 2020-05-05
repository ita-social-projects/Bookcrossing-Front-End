import {Component, OnDestroy, OnInit} from '@angular/core';
import { IBook } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book/book.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { RequestService } from 'src/app/core/services/request/request.service';
import { bookStatus } from 'src/app/core/models/bookStatus.enum';
import { RequestQueryParams } from 'src/app/core/models/requestQueryParams';
import { IRequest } from 'src/app/core/models/request';
import {IUser} from '../../../core/models/user';
import {BookQueryParams} from "../../../core/models/bookQueryParams";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SearchBarService} from "../../../core/services/searchBar/searchBar.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registered-book',
  templateUrl: './registered-book.component.html',
  styleUrls: ['./registered-book.component.scss']
})

export class RegisteredBookComponent implements OnInit, OnDestroy {

  books: IBook[];
  totalSize: number;
  user: IUser;
  bookStatus: bookStatus[] = [1,1,1,1,1]
  queryParams: BookQueryParams = new BookQueryParams;
  selectedGenres: number[];
  apiUrl: string = environment.apiUrl;

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
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 5)
      this.populateDataFromQuery();
      this.getBooks(this.queryParams);
    });
  }

  isAuthenticated(){
    return this.authentication.isAuthenticated();
  }
  getStatus(book : IBook, index: number){
    if(book.available){
      this.bookStatus[index] = bookStatus.available
    }
    else{
      let query = new RequestQueryParams();
      query.first = false;
      query.last = true;    
      this.requestService.getRequestForBook(book.id, query)
     .subscribe((value: IRequest) => {
         if(value.receiveDate){
           this.bookStatus[index] = bookStatus.reading
         }
         else{
           this.bookStatus[index] = bookStatus.requested
         }
       }, error => {})
    }
  }
  async requestBook(bookId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to request this book? Current owner will be notified about your request.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.requestService.requestBook(bookId).subscribe((value: IRequest) => {
            this.notificationService.success(this.translate
              .instant("Book is successfully requested. Please contact with current owner to receive a book"), "X");
            }, err => {
              this.notificationService.warn(this.translate
                .instant("Something went wrong!"), "X");
            });
        }
      });
    }

  onFilterChange(filterChanged: boolean) {
    this.queryParams.genres = this.selectedGenres
    if (filterChanged) {
      this.resetPageIndex()
      this.changeUrl();
    }
  }
  private populateDataFromQuery() {
    if (this.queryParams.searchTerm) {
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm)
    }
    if (typeof this.queryParams.showAvailable === 'undefined') {
      this.queryParams.showAvailable = true;
    }
    if (this.queryParams.genres) {
      let genres: number[];
      if (Array.isArray(this.queryParams.genres)) {
        genres = this.queryParams.genres.map(v => +v);
      }
      else {
        genres = [+this.queryParams.genres];
      }
      this.selectedGenres =  genres;
    }
  }

  //Navigation
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
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
  }


  //get
  getBooks(params: BookQueryParams): void {
    this.bookService.getRegisteredBooks(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          if (pageData.totalCount) {
            this.totalSize = pageData.totalCount;
          }
        },
        error: error => {
          alert('An error has occured, please try again');
        }
      });
  }

  ngOnDestroy() {
    this.searchBarService.changeSearchTerm(null);
  }
}
