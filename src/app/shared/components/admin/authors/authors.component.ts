import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IAuthor } from 'src/app/core/models/author';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthorService } from 'src/app/core/services/author/authors.service';
import { RefDirective } from '../../../directives/ref.derictive';
import { CompletePaginationParams } from 'src/app/core/models/Pagination/completePaginationParameters';
import { SortParameters } from 'src/app/core/models/Pagination/sortParameters';
import { FilterParameters } from 'src/app/core/models/Pagination/filterParameters';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
})
export class AuthorsComponent implements OnInit {
  @ViewChild(RefDirective, { static: false }) refDir: RefDirective;

  authors: IAuthor[];
  authorDisplayColumns: string[] = [
    'components.admin.authors.first-name',
    'components.admin.authors.last-name',
    'components.admin.authors.approved',
  ];
  authorProperties: string[] = ['firstName', 'lastName', 'isConfirmed'];
  queryParams: CompletePaginationParams = new CompletePaginationParams();
  fieldsForSearch: string[] = ['firstName', 'lastName'];
  totalSize: number;
  searchForm: FormGroup;

  selectedRows: any = [];

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private authorService: AuthorService
  ) {}

  public ngOnInit(): void {
    this.onAuthorEdited();
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.queryParams.sort.orderByField = this.queryParams.sort.orderByField
        ? this.queryParams.sort.orderByField
        : 'id';
      const searchFilter: FilterParameters = this.queryParams?.filters?.find(
        (filter) => this.fieldsForSearch.includes(filter.propertyName)
      );
      this.buildSearchForm(searchFilter?.value);
      this.getAuthors(this.queryParams);
    });
  }


  public get searchField(): AbstractControl {
      return this.searchForm.get('searchField');
  }

  private buildSearchForm(searchText: string): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(searchText, Validators.maxLength(60)),
    });
  }

  private onAuthorEdited(): void {
    this.authorService.authorSubmitted.subscribe((author) => {
      author.isConfirmed = null;
      const editedAuthor = this.authors.find((x) => x.id === author.id);
      if (editedAuthor) {
        const index = this.authors.indexOf(editedAuthor);
        this.authors[index] = author;
      }
    });
  }



  public search(searchText: string): void {
    const searchFilter: FilterParameters = this.queryParams?.filters?.find(
      (filter) => this.fieldsForSearch.includes(filter.propertyName));

    if (searchFilter?.value === searchText) {
      return;
    }

    this.queryParams.page = 1;
    this.queryParams.filters = [];
    for (const fieldForSearch of this.fieldsForSearch) {
      const searchTerm = searchText.split(' ');

      if (searchTerm.length === this.fieldsForSearch.length) {
        this.searchByFirstAndLastName(searchTerm);
      } else {
        this.queryParams.filters.push({
        propertyName: fieldForSearch,
        value: searchText,
      });
    }

      this.changeUrl();
  }
}

  public searchByFirstAndLastName(searchTerm: string[]) {
    this.queryParams.filters = [];
    this.queryParams.filters[0] = {
      propertyName: 'lastName',
      value: searchTerm.join(' '),
    } as FilterParameters;

    for (const fieldForSearch of this.fieldsForSearch) {
      this.queryParams.filters.push({
        propertyName: fieldForSearch,
        value: searchTerm[searchTerm.length - 1]
      });
      this.queryParams.filters.push({
        propertyName: fieldForSearch,
        value: searchTerm[0]
      });
    }
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

  public approveAuthor(author: IAuthor): void {
    const dialogRef = this.dialogService.openConfirmDialog(
      this.translate.instant('components.admin.authors.approve-confirm')
    );
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }
      author.isConfirmed = true;
      this.authorService.updateAuthor(author).subscribe({
        next: () => {
          this.notificationService.success(
            this.translate.instant('components.admin.authors.approve-success'),
            'X'
          );
          this.authors[this.authors.indexOf(author)].isConfirmed = true;
        },
        error: () => {
          this.notificationService.error(
            this.translate.instant('common-errors.error-message'),
            'X'
          );
        },
      });
    });
  }

  // Form
  public mergeClear(): void {
    this.selectedRows = [];
  }

  public mergeAuthors(): void {
    if (this.selectedRows?.length < 2) {
      this.notificationService.warn(
        this.translate.instant('components.admin.authors.error-msg-merge'),
        'X'
      );
      return;
    }
    this.authorService.formMergeAuthors = this.selectedRows;
    this.router.navigate(['admin/author-form']);
  }

  public addAuthor(): void {
    this.authorService.formMergeAuthors = null;
    this.authorService.formAuthor = null;
    this.router.navigate(['admin/author-form']);
  }

  public editAuthor(author: IAuthor): void {
    this.authorService.formMergeAuthors = null;
    this.authorService.formAuthor = author;
    this.router.navigate(['admin/author-form']);
  }

  // Get
  public getAuthors(params: CompletePaginationParams): void {
    this.authorService.getAuthorsPage(params).subscribe({
      next: (pageData) => {
        this.authors = pageData.page;
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
