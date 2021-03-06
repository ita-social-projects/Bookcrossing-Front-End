import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RefDirective } from '../../../directives/ref.derictive';
import { CompletePaginationParams } from '../../../../core/models/Pagination/completePaginationParameters';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilterParameters } from '../../../../core/models/Pagination/filterParameters';
import { SortParameters } from '../../../../core/models/Pagination/sortParameters';
import { IGenre } from '../../../../core/models/genre';
import { GenreService } from '../../../../core/services/genre/genre.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
})
export class GenresComponent implements OnInit {
  @ViewChild(RefDirective, { static: false }) refDir: RefDirective;

  public cyrillicPattern = /^[\u0400-\u04FF]+$/;
  public searchOptions = [
    {id: 1, name: 'components.admin.genres.genres'},
    {id: 2, name: 'components.admin.genres.genresUk'}
  ];
  public selectedSearchTerm = this.searchOptions[0];

  genres: IGenre[];
  genresDisplayColumns: string[] = ['components.admin.genres.genres', 'components.admin.genres.genresUk'];
  genresProperties: string[] = ['name', 'nameUk'];
  queryParams: CompletePaginationParams = new CompletePaginationParams();
  searchText: string;
  totalSize: number;

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private genreService: GenreService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.queryParams.sort.orderByField = this.queryParams.sort.orderByField
        ? this.queryParams.sort.orderByField
        : 'id';
      this.searchText = this.queryParams?.filters[0]?.value;
      this.getGenres(this.queryParams);
    });
  }

  // Pagination/URL
  public search(): void {
    if (this.cyrillicPattern.test(this.searchText)) {
      this.selectedSearchTerm = this.searchOptions[1];
    } else {
      this.selectedSearchTerm = this.searchOptions[0];
    }
    this.queryParams.page = 1;
    this.queryParams.filters = [];
    const searchField = this.selectedSearchTerm.id === 1 ? this.genresProperties[0] : this.genresProperties[1];
    this.queryParams.filters[0] = {
      propertyName: searchField,
      value: this.searchText,
    } as FilterParameters;
    this.changeUrl();
  }

  public onChangeSort(): void {
    this.changeUrl();
  }

  pageChanged(currentPage: number): void {
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

  // Get
  public getGenres(params: CompletePaginationParams): void {
    this.genreService.getGenrePage(params).subscribe({
      next: (pageData) => {
        this.genres = pageData.page;
        if (pageData.totalCount) {
          this.totalSize = pageData.totalCount;
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
