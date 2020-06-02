import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {RefDirective} from '../../../directives/ref.derictive';
import {CompletePaginationParams} from '../../../../core/models/Pagination/completePaginationParameters';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FilterParameters} from '../../../../core/models/Pagination/filterParameters';
import {SortParameters} from '../../../../core/models/Pagination/sortParameters';
import {IGenre} from '../../../../core/models/genre';
import {GenreService} from '../../../../core/services/genre/genre.service';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})
export class GenresComponent implements OnInit {

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  genres: IGenre[];
  genresDisplayColumns: string[] = ['#', 'components.admin.genres.genre'];
  genresProperties: string[] = ['id', 'name'];
  queryParams: CompletePaginationParams = new CompletePaginationParams();
  searchText: string;
  searchField = 'lastName';
  totalSize: number;


  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private genreService: GenreService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }


  ngOnInit() {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.queryParams.sort.orderByField = this.queryParams.sort.orderByField ? this.queryParams.sort.orderByField : 'id';
      this.searchText = this.queryParams?.filters[0]?.value;
      this.getGenres(this.queryParams);
    });
  }

  // Pagination/URL
  search(): void {
    if (this.queryParams?.filters[0]?.value === this.searchText) {
      return;
    }
    this.queryParams.page = 1;
    this.queryParams.filters = [];
    this.queryParams.filters[0] = {propertyName: this.searchField, value: this.searchText} as FilterParameters;
    this.changeUrl();
  }
  changeSort(selectedHeader: string) {
    this.queryParams.sort = {orderByField: selectedHeader, orderByAscending: !this.queryParams.sort.orderByAscending} as SortParameters;
    this.changeUrl();
  }
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
  }
  private changeUrl(): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.queryParams.getQueryObject()
      });
  }

  // Get
  getGenres(params: CompletePaginationParams): void {
    this.genreService.getGenrePage(params)
      .subscribe( {
        next: pageData => {
          this.genres = pageData.page;
          if (pageData.totalCount) {
            this.totalSize = pageData.totalCount;
          }
        },
        error: () => {
          this.notificationService.error(this.translate
            .instant('common-errors.error-message'), 'X');
        }
      });
  }
}
