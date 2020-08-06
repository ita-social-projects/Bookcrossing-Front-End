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

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @ViewChild(RefDirective, { static: false }) refDir: RefDirective;

  public users: IUserInfo[];
  public usersDisplayColumns: string[];
  public usersProperties: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'registeredDate',
  ];
  private fieldsForSearch = ['firstName', 'lastName', 'email'];
  public queryParams: CompletePaginationParams = new CompletePaginationParams();
  public totalSize: number;

  public searchForm: FormGroup;
  public get searchField(): AbstractControl {
    return this.searchForm.get('searchField');
  }
  private errorTimeout: NodeJS.Timeout;

  public usersLoaded: boolean = false;

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

      this.buildSearchForm(this.queryParams?.filters[0]?.value);
      this.getUsers(this.queryParams);
    });
  }

  public search(searchText: string): void {
    if (this.queryParams?.filters[0]?.value === searchText) {
      return;
    }

    this.queryParams.page = 1;
    this.queryParams.filters = [];
    for (const fieldForSearch of this.fieldsForSearch) {
      this.queryParams.filters.push({
        propertyName: fieldForSearch,
        value: searchText,
      });
    }

    this.changeUrl();
  }

  public onSortHeaderChanged(selectedHeader: string): void {
    this.queryParams.sort = {
      orderByField: selectedHeader,
      orderByAscending: !this.queryParams.sort.orderByAscending,
    } as SortParameters;

    this.changeUrl();
  }

  public onPageChanged(page: number): void {
    this.queryParams.page = page;
    this.queryParams.firstRequest = false;

    this.changeUrl();
  }

  public onViewButtonClicked(user: IUserInfo) {
    this.notificationService.info(
      "This action must redirect admin to user's details page. User id = " +
        user.id,
      'X'
    );
  }

  public checkLength(control: AbstractControl) {
    if (!control) return;

    const maxLength: number = control.errors?.maxlength?.requiredLength;
    if (!maxLength) return;

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

  private buildSearchForm(searchText: string): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(searchText, Validators.maxLength(40)),
    });
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
        this.totalSize = pageData.totalCount;
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
