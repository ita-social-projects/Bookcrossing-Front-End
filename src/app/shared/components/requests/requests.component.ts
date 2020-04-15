import { Component, OnInit } from '@angular/core';
import { IRequest } from 'src/app/core/models/request'
import { ActivatedRoute, Params, Router } from "@angular/router";
import { switchMap } from 'rxjs/operators';
import { NotificationService } from "../../../core/services/notification/notification.service";
import {TranslateService} from "@ngx-translate/core";
import { PaginationParameters } from 'src/app/core/models/paginationParameters';
import { RequestService } from 'src/app/core/services/request/request.service'

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  providers: [RequestService]
})
export class RequestsComponent implements OnInit {
  
  bookId: number;
  requests: IRequest[];
  queryParams : PaginationParameters = new PaginationParameters();
  searchText : string;
  totalSize : number;  
  
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private router : Router,
  ) {}

  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);
  this.route.queryParams.subscribe((params : Params) => {
    this.mapParams(params);      
    this.searchText = params.searchQuery;
    this.getAllRequestsByBookId(this.bookId, this.queryParams);
  })
  }
  getAllRequestsByBookId(bookId: number, params : PaginationParameters) : void {      
    this.requestService.getAllRequestesByBookId(bookId, params)
    .subscribe( {
      next: pageData => {
      this.requests = pageData.page;
      if(pageData.totalCount){
        this.totalSize = pageData.totalCount;
      }
    },
    error: error => this.notificationService.warn(this.translate
      .instant("Something went wrong!"))
   });   
  };

  approveRequest(requestId: number) {
    this.requestService.approveRequest(requestId).subscribe((value: boolean) => {
      if(value){
        this.notificationService.success(this.translate
          .instant("Request successfully approved"))
      }

      }, err => {
        this.notificationService.warn(this.translate
          .instant("Something went wrong!"))
      })
  }

  deleteRequest(requestId: number) {
    this.requestService.deleteRequest(requestId).subscribe((value: boolean) => {
      if(value) {
        this.notificationService.success(this.translate
          .instant("Request successfully deleted"))
      }
      }, err => {
        this.notificationService.warn(this.translate
          .instant("Something went wrong!"));
      })
  }
  search() : void{
    if(this.queryParams.searchQuery == this.searchText){
      return;
    }
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
    this.queryParams.searchQuery = this.searchText;
    this.changeUrl(this.queryParams);
  }
  changeSort(selectedHeader : string){  
    this.queryParams.orderByField = selectedHeader; 
    this.queryParams.searchField = selectedHeader;
    this.queryParams.orderByAscending = !this.queryParams.orderByAscending;
    this.changeUrl(this.queryParams);
  }
  pageChanged(currentPage : number) : void{      
      this.queryParams.page = currentPage; 
      this.queryParams.firstRequest = false; 
      this.changeUrl(this.queryParams);
  }
  private changeUrl(params : PaginationParameters)  : void{
    this.router.navigate(['.'], 
      {
        relativeTo: this.route, 
        queryParams: params,
        queryParamsHandling: 'merge',
      });
  }  
  private mapParams(params: Params, defaultPage : number = 1, defultPageSize : number = 5, defaultSearchField : string = "id", ) {
    this.queryParams.page = params.page ? +params.page : defaultPage;
    this.queryParams.searchQuery = params.searchQuery ? params.searchQuery : null;    
    this.queryParams.pageSize = params.pageSize ? +params.pageSize : defultPageSize;
    this.queryParams.searchField = params.searchField ? params.searchField : defaultSearchField;
    this.queryParams.orderByAscending = params.orderByAscending ? params.orderByAscending : true;
    this.queryParams.orderByField = params.orderByField ? params.orderByField : defaultSearchField;
  } 

}
