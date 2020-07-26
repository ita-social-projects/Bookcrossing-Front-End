import {Component, OnInit} from '@angular/core';
import {IRequest} from 'src/app/core/models/request';
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
import {bookState} from 'src/app/core/models/bookState.enum';
import {RequestQueryParams} from '../../../core/models/requestQueryParams';
import { booksPage } from 'src/app/core/models/booksPage.enum';
import { WishListService } from 'src/app/core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  providers: []
})
export class RequestsComponent implements OnInit {

  isBlockView: boolean = false;
  userId: number;
  isRequester: boolean[] = [true, true, true, true, true ,true, true, true];
  isWisher: boolean[] = [undefined, undefined, undefined, undefined, undefined ,undefined, undefined, undefined];
  disabledButton: boolean = false;
  viewMode: string;
  requests: IRequest[];
  booksPage: booksPage = booksPage.requested;
  books: IBook[];
  totalSize: number;
  queryParams: BookQueryParams = new BookQueryParams;
  selectedGenres: number[];
  selectedLanguages: number[];
  apiUrl: string = environment.apiUrl;
  route = this.router.url;

  filter: string;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private routeActive: ActivatedRoute,
    private requestService: RequestService,
    private searchBarService : SearchBarService,
    private router : Router,
    private dialogService: DialogService,
    private authentication: AuthenticationService,
    private wishListService: WishListService
  ) {}

  ngOnInit() {
    this.routeActive.queryParams.subscribe(query => {
      this.filter = query.filter;})
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 8)
      this.populateDataFromQuery();
      this.getUserRequests(this.queryParams);
    })
    this.router.events.subscribe((val) => {
      if( this.router.url != ''){
        this.route =  this.router.url;
      } 
    });
  }

  isAuthenticated(){
    return this.authentication.isAuthenticated();
  }

  getUserRequests(params: BookQueryParams) : void {
    this.requestService.getUserRequestsPage(params)
    .subscribe( {
      next: pageData => {
        this.requests = pageData.page;
        let books = [];
        pageData.page.forEach(function(item) {
          books.push(item.book)
        })
        this.books = books;
        for(let i = 0; i < 8; i++)
        {
          this.isWisher[i] = false;
        }
        for(var i = 0; i < this.books.length; i++){
          this.getWhichBooksWished(this.books[i], i);
        }
      if(pageData.totalCount){
        this.totalSize = pageData.totalCount;
      }
    }
   });
  };

  getWhichBooksWished(book: IBook, key: number) {
    this.wishListService.isWished(book.id).subscribe((value: boolean) => {
      if(value) this.isWisher[key] = true;
    });
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
          let request = this.requests.find(x=>x.book.id === bookId)
          this.requestService.deleteRequest(request.id).subscribe(() => {
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

  onFilterChange(filterChanged : boolean){
    this.queryParams.genres = this.selectedGenres
    this.queryParams.languages = this.selectedLanguages
    if(filterChanged){
      this.resetPageIndex()
      this.changeUrl();
    }
  }

  async requestBook(bookId: number) {}

  private populateDataFromQuery() {
    if(this.queryParams.searchTerm){
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm)
    }
    this.queryParams.showAvailable = false;
    if(this.queryParams.genres){
      let genres: number[];
      if(Array.isArray(this.queryParams.genres))
       genres = this.queryParams.genres.map(v=>+v);
       else{
         genres = [+this.queryParams.genres];
       }
        this.selectedGenres =  genres;
    }
    if(this.queryParams.languages){
      let languages: number[];
      if(Array.isArray(this.queryParams.languages))
       languages = this.queryParams.languages.map(v=>+v);
       else{
         languages = [+this.queryParams.languages];
       }
        this.selectedLanguages =  languages;
    }
  }
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
      this.getUserRequests(this.queryParams);
  }
  onViewModeChange(viewModeChanged: string) {
    if(viewModeChanged === 'block'){
      this.isBlockView = true;
    }
    else {
      this.isBlockView = false;
    }
  }

  changeWishList(book:IBook, key:number):void
  {
      if(this.isWisher[key]) 
      {
        this.wishListService.removeFromWishList(book.id).subscribe(
          (data) => { this.isWisher[key] = false; },
          (error) => {
            this.notificationService.error(
              this.translate.instant('Something went wrong'),
              'X'
            );
          }
        );
      }
      else
      {
        this.wishListService.addToWishList(book.id).subscribe(
        (data) => { this.isWisher[key] = true; },
          (error) => {
            this.notificationService.error(
              this.translate.instant('Cannot add own book to the wish list'),
              'X'
            );
          }
        );
      }
  }
}