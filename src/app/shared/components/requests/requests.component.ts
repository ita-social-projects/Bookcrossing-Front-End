import { Component, OnInit } from '@angular/core';
import { IRequest } from 'src/app/core/models/request'
import { ActivatedRoute, Params, Router } from "@angular/router";
import { switchMap } from 'rxjs/operators';
import { NotificationService } from "../../../core/services/notification/notification.service";
import {TranslateService} from "@ngx-translate/core";
import { PaginationParameters } from 'src/app/core/models/Pagination/paginationParameters';
import { RequestService } from 'src/app/core/services/request/request.service'
import { PaginationService } from 'src/app/core/services/pagination/pagination.service';
import { FilterParameters } from 'src/app/core/models/Pagination/FilterParameters';
import { SortParameters } from 'src/app/core/models/Pagination/SortParameters';

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
  searchField :string = "id";
  totalSize : number;  
  
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private paginationService : PaginationService,
    private router : Router,
  ) {}

  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);
  this.route.queryParams.subscribe((params : Params) => {
    this.queryParams = this.paginationService.mapToPaginationParams(params)
    this.searchText = this.queryParams?.filters[0]?.value;
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
    if(this.queryParams?.filters[0]?.value == this.searchText){
      return
    }  
    this.queryParams.page = 1;
    this.queryParams.filters[0] = <FilterParameters> {propertyName:this.searchField, value: this.searchText}
    this.changeUrl(this.queryParams);
  }
  changeSort(selectedHeader : string){  
    this.queryParams.sort = <SortParameters> {orderByField:selectedHeader, orderByAscending: !this.queryParams.sort.orderByAscending}
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
        queryParams: this.paginationService.mapToParams(params),
        queryParamsHandling: 'merge',
      });
  }  
}
