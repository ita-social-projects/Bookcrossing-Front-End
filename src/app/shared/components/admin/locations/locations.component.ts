import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RefDirective } from '../../../directives/ref.derictive';
import { ILocation } from '../../../../core/models/location';
import { CompletePaginationParams } from '../../../../core/models/Pagination/completePaginationParameters';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocationService } from '../../../../core/services/location/location.service';
import { FilterParameters } from '../../../../core/models/Pagination/filterParameters';
import { SortParameters } from '../../../../core/models/Pagination/sortParameters';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  public locations: ILocation[];
  public locationDisplayColumns: string[] = [
    'components.admin.locations.city',
    'components.admin.locations.street',
    'components.admin.locations.office-name',
    'components.admin.locations.active',
  ];
  public locationProperties: string[] = [
    'city',
    'street',
    'officeName',
    'isActive',
  ];
  public queryParams: CompletePaginationParams = new CompletePaginationParams();
  public searchText: string;
  public searchField = 'street';
  public totalSize: number;
  public showInactive: boolean;

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.queryParams.sort.orderByField = this.queryParams.sort.orderByField
        ? this.queryParams.sort.orderByField
        : 'id';
      if (this.showInactive === undefined) {
        this.showInactive = false;
        this.queryParams.filters[0] = {
          propertyName: 'isActive',
          value: 'false',
          method: 'NotEqual',
          operand: 'And',
        };
      } else if (!this.queryParams.filters[0]) {
        this.showInactive = true;
      }
      this.searchText = this.queryParams?.filters[1]?.value;
      this.queryParams.page =
        this.queryParams.page > this.totalSize
          ? this.totalSize
          : this.queryParams.page;
      this.GetLocations(this.queryParams);
    });
  }

  public toggleInactive(): void {
    this.showInactive = !this.showInactive;
    if (this.showInactive) {
      this.queryParams.filters[0] = null;
    } else {
      this.queryParams.filters[0] = {
        propertyName: 'isActive',
        value: this.showInactive + '',
        method: 'NotEqual',
        operand: 'And',
      };
    }
    this.changeUrl();
  }

  // Pagination/URL
  public search(): void {
    if (this.queryParams?.filters[1]?.value === this.searchText) {
      return;
    }
    this.queryParams.page = 1;
    this.queryParams.filters[1] = {
      propertyName: this.searchField,
      value: this.searchText,
    };
    this.changeUrl();
  }

  public onChangeSort(): void {
    this.changeUrl();
  }

  public pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
  }

  private changeUrl(): void {
    this.router.navigate(['.'], {
      relativeTo: this.routeActive,
      queryParams: this.queryParams.getQueryObject(),
    });
  }

  // CRUD
  public AddLocation(): void {
    this.router.navigate(['admin/location-form']);
  }

  public EditLocation(location: ILocation): void {
    this.router.navigate(['admin/location-form', location]);
  }

  public GetLocations(params: CompletePaginationParams): void {
    this.locationService.getLocationsPage(params).subscribe({
      next: (pageData) => {
        this.locations = pageData.page;
        if (pageData.totalCount) {
          this.totalSize = pageData.totalCount;
        }
        // Redirect in page refreshed but no longer longer has content. We redirect to last viable page.
        if (
          pageData?.page?.length < 1 &&
          this.queryParams.page >
            pageData.totalCount / this.queryParams.pageSize
        ) {
          this.queryParams.page = Math.ceil(
            pageData.totalCount / this.queryParams.pageSize
          );
          console.log(this.queryParams.page);
          this.changeUrl();
        }
      },
      error: () => {
        this.notificationService.error(
          this.translate.instant('common-errors.error-message'),
          'X'
        );
      },
    });
  }
}
