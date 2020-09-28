import { Component, OnInit, ViewChild } from '@angular/core';
import { RefDirective } from '../../../directives/ref.derictive';
import { CompletePaginationParams } from '../../../../core/models/Pagination/completePaginationParameters';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SortParameters } from '../../../../core/models/Pagination/sortParameters';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { IUserInfo } from '../../../../core/models/userInfo';
import { UserService } from 'src/app/core/services/user/user.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { FilterParameters } from 'src/app/core/models/Pagination/filterParameters';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @ViewChild(RefDirective, { static: false }) refDir: RefDirective;

  public users: IUserInfo[];
  public usersDisplayColumns: Array<string>;
  public usersProperties: Array<string> = [
    'id',
    'firstName',
    'lastName',
    'email',
    'registeredDate',
  ];
  private fieldsForSearch = ['firstName', 'lastName', 'email'];
  public queryParams: CompletePaginationParams = new CompletePaginationParams();
  public totalSize: number;
  public showDeleted: boolean;
  private isDeletedDispalyName = this.translate.instant('components.admin.users.is-active');
  private IsDeletedPropertyName = 'isDeleted';

  public searchForm: FormGroup;

  public get searchField(): AbstractControl {
    return this.searchForm.get('searchField');
  }

  private errorTimeout: NodeJS.Timeout;

  public usersLoaded = false;

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    this.usersDisplayColumns = [
      '#',
      translate.instant('components.admin.users.first-name'),
      translate.instant('components.admin.users.last-name'),
      'Email',
      translate.instant('components.admin.users.register-date'),
    ];
  }

  public ngOnInit(): void {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.queryParams.sort.orderByField = this.queryParams.sort.orderByField
        ? this.queryParams.sort.orderByField
        : 'id';

      this.initShowDeleted();
      const searchFilter: FilterParameters = this.queryParams?.filters?.find(
        (filter) => this.fieldsForSearch.includes(filter.propertyName)
      );
      this.buildSearchForm(searchFilter?.value);
      this.getUsers(this.queryParams);
    });
  }

  public search(searchText: string): void {
    const searchFilter: FilterParameters = this.queryParams?.filters?.find(
      (filter) => this.fieldsForSearch.includes(filter.propertyName)
    );
    if (searchFilter?.value === searchText) {
      return;
    }

    this.queryParams.page = 1;
    for (const fieldForSearch of this.fieldsForSearch) {
      const searchFilterIndex: number = this.queryParams?.filters?.findIndex(
        (filter) => filter.propertyName === fieldForSearch
      );
      if (searchFilterIndex !== -1) {
        this.queryParams?.filters?.splice(searchFilterIndex, 1);
      }

      this.queryParams.filters.push({
        propertyName: fieldForSearch,
        value: searchText,
      });
    }

    this.changeUrl();
  }

  public onShowDeletedChange(): void {
    this.showDeleted = !this.showDeleted;
    if (this.showDeleted) {
      const isDeletedFilterIndex = this.queryParams?.filters?.findIndex(
        (filter) => filter.propertyName === this.IsDeletedPropertyName
      );
      if (isDeletedFilterIndex !== -1) {
        this.queryParams?.filters?.splice(isDeletedFilterIndex, 1);
      }
    } else {
      this.queryParams.filters.push({
        propertyName: this.IsDeletedPropertyName,
        value: 'false',
        method: 'Equal',
        operand: 'And',
      });
    }

    this.changeUrl();
  }

  public onSortHeaderChanged(): void {
    this.changeUrl();
  }

  public onPageChanged(page: number): void {
    this.queryParams.page = page;
    this.queryParams.firstRequest = false;

    this.changeUrl();
  }

  public onViewButtonClicked(user: IUserInfo) {
    this.router.navigate(['admin', 'user', user.id]);
  }

  public checkLength(control: AbstractControl) {
    if (!control) { return; }

    const maxLength: number = control.errors?.maxlength?.requiredLength;
    if (!maxLength) { return; }

    if (control.value.length > maxLength) {
      control.setValue(control.value.substr(0, maxLength));

      control.setErrors({
        maxlength: { requiredLength: maxLength },
      });
      control.markAsTouched();

      clearInterval(this.errorTimeout);
      this.errorTimeout = setTimeout(() => {
        control.setErrors(null);
        control.markAsTouched();
      }, 2000);
    }
  }

  private initShowDeleted() {
    const isDeletedFilterIndex: number = this.queryParams?.filters?.findIndex(
      (filter) => filter.propertyName === this.IsDeletedPropertyName
    );
    if (isDeletedFilterIndex !== -1) {
      this.showDeleted = false;
    } else if (this.showDeleted === undefined) {
      this.showDeleted = false;
      this.queryParams.filters.push({
        propertyName: this.IsDeletedPropertyName,
        value: 'false',
        method: 'Equal',
        operand: 'And',
      });
    } else {
      this.showDeleted = true;
    }
  }

  private buildSearchForm(searchText: string): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(searchText, Validators.maxLength(40)),
    });
  }

  private configureIsDeletedColumn(): void {
    const isDeletedDisplayIndex = this.usersDisplayColumns.findIndex(
      (value) => value === this.isDeletedDispalyName
    );
    const isDeletedPropertyIndex = this.usersProperties.findIndex(
      (value) => value === this.IsDeletedPropertyName
    );
    if (this.showDeleted) {
      if (isDeletedDisplayIndex === -1) {
        this.usersDisplayColumns.push(this.isDeletedDispalyName);
      }
      if (isDeletedPropertyIndex === -1) {
        this.usersProperties.push(this.IsDeletedPropertyName);
      }
    } else {
      if (isDeletedDisplayIndex !== -1) {
        this.usersDisplayColumns.splice(isDeletedDisplayIndex, 1);
      }
      if (isDeletedPropertyIndex !== -1) {
        this.usersProperties.splice(isDeletedPropertyIndex, 1);
      }
    }
  }

  private changeUrl(): void {
    this.router.navigate(['.'], {
      relativeTo: this.routeActive,
      queryParams: this.queryParams.getQueryObject(),
    });
  }

  private getUsers(params: CompletePaginationParams): void {
    this.userService.getUsers(params).subscribe({
      next: (pageData) => {
        this.users = pageData.page;
        for (const user of this.users) {
          user.registeredDate = new Date(user.registeredDate);
          user.registeredDate.toString = Date.prototype.toLocaleDateString;
          user.isDeleted = !user.isDeleted;
        }

        this.totalSize = pageData.totalCount;
        this.configureIsDeletedColumn();
        this.usersLoaded = true;
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
