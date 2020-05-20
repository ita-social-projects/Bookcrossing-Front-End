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
import {bookStatus} from 'src/app/core/models/bookStatus.enum';
import {RequestQueryParams} from '../../../core/models/requestQueryParams';

@Component({
  selector: 'app-requests',
  templateUrl: '../books/books.component.html',
  styleUrls: ['../books/books.component.scss'],
  providers: []
})
export class RequestsComponent implements OnInit {

  isBlockView: boolean = false;
  viewMode: string;
  requests: IRequest[] = [];
  isRequester: boolean = true;
  books: IBook[];
  totalSize: number;
  bookStatus: bookStatus[] = [bookStatus.requested,bookStatus.requested,bookStatus.requested,bookStatus.requested,bookStatus.requested]

  queryParams: BookQueryParams = new BookQueryParams;
  selectedGenres: number[];
  apiUrl: string = environment.apiUrl;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private searchBarService : SearchBarService,
    private router : Router,
    private dialogService: DialogService,
    private authentication: AuthenticationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 5)
      this.populateDataFromQuery();
      this.getUserRequests(this.queryParams);
    })
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
      if(pageData.totalCount){
        this.totalSize = pageData.totalCount;
      }
    },
    error: error => this.notificationService.error(this.translate
      .instant("You haven`t made any requests yet!"), "X")
   });
  };

  async requestBook(bookId: number){}

  async cancelRequest(bookId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to cancel request? Current owner will be notified about your cancellation.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          let request = this.requests.find(x=>x.book.id === bookId)
          this.requestService.deleteRequest(request.id).subscribe(() => {
            this.ngOnInit();
              this.notificationService.success(this.translate
                .instant("Request is cancelled."), "X");
            }, err => {
              this.notificationService.error(this.translate
                .instant("Something went wrong!"), "X");
            });
        }
      });
  }
  onFilterChange(filterChanged : boolean){
    this.queryParams.genres = this.selectedGenres
    if(filterChanged){
      this.resetPageIndex()
      this.changeUrl();
    }
  }
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
        relativeTo: this.route,
        queryParams: this.queryParams,
      });
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
