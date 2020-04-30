import { Component, OnInit } from '@angular/core';
import { IRequest } from 'src/app/core/models/request'
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NotificationService } from "../../../core/services/notification/notification.service";
import {TranslateService} from "@ngx-translate/core";
import { RequestService } from 'src/app/core/services/request/request.service'
import { PaginationService } from 'src/app/core/services/pagination/pagination.service';
import { FilterParameters } from 'src/app/core/models/Pagination/FilterParameters';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { BookParameters } from 'src/app/core/models/Pagination/bookParameters';
import { ILocation } from 'src/app/core/models/location';
import { IGenre } from 'src/app/core/models/genre';
import { LocationService } from 'src/app/core/services/location/location.service';
import { GenreService } from 'src/app/core/services/genre/genre';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  providers: []
})
export class RequestsComponent implements OnInit {
  
  requests: IRequest[];
  queryParams: BookParameters = new BookParameters;
  searchText: string;

  selectedLocation: number;
  loadedLocation: number;
  locations: ILocation[] = [];

  selectedGenres: string[];
  loadedGenres: string[];
  genres: IGenre[] = [];

  totalSize: number;

  showAvailableOnly: boolean = true;
  availableFilter: FilterParameters = { propertyName: "Available", value: true + '', method: "Equal" };
  
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private genreService: GenreService,
    private locationService: LocationService,
    private paginationService : PaginationService,
    private router : Router,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.getAllGenres();
    this.getLocation();
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParams = this.paginationService.mapFromqQueryToBookParams(params, 1, 5)
      this.getUserRequests(this.queryParams);
    })
  }

  getUserRequests(params: BookParameters) : void {      
    this.requestService.getUserRequestsPage(params)
    .subscribe( {
      next: pageData => {
      this.requests = pageData.page;
      if(pageData.totalCount){
        this.totalSize = pageData.totalCount;
      }
    },
    error: error => this.notificationService.warn(this.translate
      .instant("An error has occured, please try again!"))
   });   
  };

  async cancelRequest(requestId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to cancel request? Current owner will be notified about your cancelation.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.requestService.deleteRequest(requestId).subscribe((value: boolean) => {
            let canceled = value;
            if(canceled){
              this.notificationService.success(this.translate
                .instant("Request is cancelled."));
            }
            }, err => {
              this.notificationService.warn(this.translate
                .instant("Something went wrong!"));
            });
        }
      });

  }
  onCategoryOpened(isOpened: Boolean) {
    if (!isOpened && this.selectedGenres != this.loadedGenres) {
      this.loadedGenres = this.selectedGenres;
      this.addCategoryFilters(this.selectedGenres)
    }
  }
  resetCategories(): void {
    this.selectedGenres = [];
    this.loadedGenres = [];
    this.addCategoryFilters(this.selectedGenres)
  }
  addCategoryFilters(genreNames: string[]) {
    this.queryParams.genreFilters = [];
    for (let name of genreNames) {
      this.queryParams.genreFilters.push(<FilterParameters>{ propertyName: "Genre.Name", value: name });
    }
    this.resetPageIndex();
    this.changeUrl(this.queryParams);
  }

  onLocationOpened(isOpened: Boolean) {
    if (!isOpened && this.selectedLocation != this.loadedLocation) {
      this.loadedLocation = this.selectedLocation;
      this.addLocationFilter(this.selectedLocation)
    }
  }
  resetLocation(): void {
    this.selectedLocation = null;
    this.loadedLocation = null;
    this.addLocationFilter(this.selectedLocation)
  }
  addLocationFilter(locationId: number) {    
    this.queryParams.locationFilters = [];
    if(locationId){
      this.queryParams.locationFilters[0] = <FilterParameters>{ propertyName: "Location.Id", value: locationId + '', method: "Equal" };
    }    
    this.resetPageIndex();
    this.changeUrl(this.queryParams);
  }

  resetPageIndex() : void {
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
  }
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl(this.queryParams);
  }
  private changeUrl(params: BookParameters): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.route,
        queryParams: this.paginationService.mapToQueryObjectBookParams(params),
      });
  }
  getLocation() {
    this.locationService.getLocation().subscribe(
      (data) => {
        this.locations = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getAllGenres() {
    this.genreService.getGenre().subscribe(
      (data) => {
        this.genres = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
