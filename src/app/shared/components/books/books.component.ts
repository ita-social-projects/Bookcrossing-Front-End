import {RequestService} from 'src/app/core/services/request/request.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBook} from 'src/app/core/models/book';
import {BookService} from 'src/app/core/services/book/book.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {BookQueryParams} from 'src/app/core/models/bookQueryParams';
import {SearchBarService} from 'src/app/core/services/searchBar/searchBar.service';
import {AuthenticationService} from 'src/app/core/services/authentication/authentication.service';
import {DialogService} from 'src/app/core/services/dialog/dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from 'src/app/core/services/notification/notification.service';
import {IRequest} from 'src/app/core/models/request';
import {bookState} from 'src/app/core/models/bookState.enum';
import {RequestQueryParams} from 'src/app/core/models/requestQueryParams';
import {environment} from 'src/environments/environment';
import {booksPage} from 'src/app/core/models/booksPage.enum';
import {IBookPut} from '../../../core/models/bookPut';
import { FormGroup } from '@angular/forms';
import { WishListService } from 'src/app/core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit,OnDestroy {

  isBlockView: boolean = false;
  userId: number;
  isRequester: boolean[] = [undefined, undefined, undefined, undefined, undefined ,undefined, undefined, undefined];
  isWisher: boolean[] = [undefined, undefined, undefined, undefined, undefined ,undefined, undefined, undefined];
  requestIds: Object = {};
  disabledButton: boolean = false;
  books: IBook[];
  totalSize: number;
  booksPage: booksPage = booksPage.list;
  queryParams: BookQueryParams = new BookQueryParams;
  apiUrl: string = environment.apiUrl;
  selectedGenres: number[];
  selectedLanguages: number[];
  route = this.router.url;

  filter: string;
  
  constructor(private routeActive: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private searchBarService : SearchBarService,
    private authentication: AuthenticationService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private requestService: RequestService,
    private wishListService: WishListService
  ) { }

  ngOnInit(): void {
    this.routeActive.queryParams.subscribe(query => {
      this.filter = query.filter;})
      if (!this.isAuthenticated() && (this.filter == "registered" || "read" || "current"))
      {
        this.router.navigate(['/login']);
      }
    this.getUserId()
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 8);
      this.populateDataFromQuery();
      for(let i = 0; i < 8; i++)
    {
      this.isWisher[i] = false;
    }
      this.getBooks(this.queryParams);
    });
    this.router.events.subscribe((val) => {
      if( this.router.url != ''){
        this.route =  this.router.url;
      } 
    });
  }

  isAuthenticated(): boolean{
    return this.authentication.isAuthenticated();
  }

  getUserId():void{
    if (this.isAuthenticated()) {
      this.authentication.getUserId().subscribe((value: number) => {
        this.userId = value;
        });
    }
  }

  getUserWhoRequested(book: IBook, key: number):void {
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

  getWhichBooksWished(book: IBook, key: number):void {
    this.wishListService.isWished(book.id).subscribe((value: boolean) => {
      if(value) this.isWisher[key] = true;
    });
  }

  async cancelRequest(bookId: number):Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to cancel request? Current owner will be notified about your cancellation.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.disabledButton = true;
          this.requestService.deleteRequest(this.requestIds[bookId]).subscribe(() => {
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

  async requestBook(bookId: number):Promise<void> {
    const userHasValidLocation: boolean = await this.authentication.validateLocation();
    if(!userHasValidLocation) return;
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to request this book? Current owner will be notified about your request.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.disabledButton = true;
          this.requestService.requestBook(bookId).subscribe((value: IRequest) => {
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
  onFilterChange(filterChanged : boolean):void{
    this.queryParams.genres = this.selectedGenres
    this.queryParams.languages = this.selectedLanguages
    if(filterChanged){
      this.resetPageIndex()
      this.changeUrl();
    }
  }
  private populateDataFromQuery():void {
    if(this.queryParams.searchTerm){
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm)
    }
    if(typeof this.queryParams.showAvailable === "undefined"){
      this.queryParams.showAvailable = true;
    }
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

  //Navigation
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
    for(let i = 0; i < 8; i++)
    {
      this.isWisher[i] = false;
    }
    this.getBooks(this.queryParams);
  }


  //get
  getBooks(params: BookQueryParams): void{
    switch(this.filter) { 
      case "registered": { 
         this.getRegisteredBooks(params) ;
         break; 
      } 
      case "current": { 
         this.getCurrentOwnedBooks(params); 
         break; 
      } 
      case "read": { 
        this.getReadBooks(params); 
        break; 
     }
      default: { 
         this.getAllBooks(params); 
         break; 
      } 
   } 
  }


  getAllBooks(params: BookQueryParams): void {
    this.bookService.getBooksPage(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          if(this.isAuthenticated()){
            for(var i = 0; i<pageData.page.length; i++){
              this.getWhichBooksWished(pageData.page[i], i);
              this.getUserWhoRequested(pageData.page[i], i);
            }
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

  getCurrentOwnedBooks(params: BookQueryParams): void {
    this.bookService.getCurrentOwnedBooks(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          for(var i = 0; i<pageData.page.length; i++){
            this.getWhichBooksWished(pageData.page[i], i);
            this.getUserWhoRequested(pageData.page[i], i);
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

  getReadBooks(params: BookQueryParams): void {
    this.bookService.getReadBooks(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          for(var i = 0; i<pageData.page.length; i++){
            this.getWhichBooksWished(pageData.page[i], i);
            this.getUserWhoRequested(pageData.page[i], i);
          }
          if (pageData.totalCount) {
            this.totalSize = pageData.totalCount;
          }
        },
        error: error => {
          alert('An error has occured, please try again');
        }
      });
  }

  getRegisteredBooks(params: BookQueryParams): void {
    this.bookService.getRegisteredBooks(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          for(var i = 0; i<pageData.page.length; i++){
            this.getWhichBooksWished(pageData.page[i], i);
            this.getUserWhoRequested(pageData.page[i], i);
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

  ngOnDestroy():void{
    this.searchBarService.changeSearchTerm(null)
  }

  onViewModeChange(viewModeChanged: string):void {
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
