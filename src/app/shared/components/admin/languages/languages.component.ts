import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {RefDirective} from '../../../directives/ref.derictive';
import {CompletePaginationParams} from '../../../../core/models/Pagination/completePaginationParameters';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FilterParameters} from '../../../../core/models/Pagination/filterParameters';
import {SortParameters} from '../../../../core/models/Pagination/sortParameters';
import {BookLanguageService} from '../../../../core/services/bookLanguage/bookLanguage.service';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {ILanguage} from '../../../../core/models/language';

@Component({
  selector: 'app-book-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class BookLanguagesComponent implements OnInit {

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  languages: ILanguage[];
  languagesDisplayColumns: string[] = ['#', 'components.admin.languages.language'];
  languagesProperties: string[] = ['id', 'name'];
  queryParams: CompletePaginationParams = new CompletePaginationParams();
  searchText: string;
  searchField = 'name';
  totalSize: number;


  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private languageService: BookLanguageService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }


  ngOnInit() {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.queryParams.sort.orderByField = this.queryParams.sort.orderByField ? this.queryParams.sort.orderByField : 'id';
      this.searchText = this.queryParams?.filters[0]?.value;
      this.getLanguages(this.queryParams);
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
  getLanguages(params: CompletePaginationParams): void {
    this.languageService.getLanguagePage(params)
      .subscribe( {
        next: pageData => {
          this.languages = pageData.page;
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

  addLanguage() {
    this.languageService.formLanguage = null;
    this.router.navigate(['admin/language-form']);
  }

  editLanguage(language: ILanguage) {
    this.languageService.formLanguage = language;
    this.router.navigate(['admin/language-form']);
  }

  deleteLanguage(language: ILanguage): void {
    this.languageService.deleteLanguage(language.id)
      .subscribe( {
        next: () => {
          if (this.languages.length === 1 && this.queryParams.page > 1) {
            this.queryParams.page -= 1;
          }
          this.getLanguages(this.queryParams);
          this.notificationService.success(this.translate
            .instant('components.admin.languages.delete-success'), 'X');
        },
        error: (response: any) => {
          const serverError = 500;
          if (response.status === serverError) {
            this.notificationService.error(this.translate
              .instant('common-errors.database-links'), 'X');
          } else {
            this.notificationService.error(this.translate
              .instant('common-errors.error-message'), 'X');
          }
        }
      });
  }
}
