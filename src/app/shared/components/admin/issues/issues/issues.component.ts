import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IIssue } from 'src/app/core/models/issue';
import { CompletePaginationParams } from 'src/app/core/models/Pagination/completePaginationParameters';
import { FilterParameters } from 'src/app/core/models/Pagination/filterParameters';
import { IssueService } from 'src/app/core/services/issue/issue.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {
  issues: IIssue[];
  issuesDisplayColumns: string[] = [
    'components.admin.issues.issues'
  ];
  issueProperties: string[] = ['name'];
  issuePropertiesUk: string[] = ['nameUk'];
  queryParams: CompletePaginationParams = new CompletePaginationParams();
  searchText: string;
  searchField = 'name';
  totalSize: number;

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private issueService: IssueService,
    private translate: TranslateService,
  ) {}

  public ngOnInit(): void {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.queryParams.sort.orderByField = this.queryParams.sort.orderByField
        ? this.queryParams.sort.orderByField
        : 'id';
      this.searchText = this.queryParams?.filters[0]?.value;
      this.getIssues(this.queryParams);
    });
  }

  // Pagination/URL
  public search(): void {
    if (this.queryParams?.filters[0]?.value === this.searchText) {
      return;
    }
    this.queryParams.page = 1;
    this.queryParams.filters = [];
    if (!this.isEn()) {
      this.searchField = 'nameUk';
    } else {
      this.searchField = 'name';
    }
    this.queryParams.filters[0] = {
      propertyName: this.searchField,
      value: this.searchText,
    } as FilterParameters;
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

  // Get
  public getIssues(params: CompletePaginationParams): void {
    this.issueService.getIssuePage(params).subscribe({
      next: (pageData) => {
        this.issues = pageData.page;
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

  public editIssue(issue: IIssue): void {
    this.issueService.formIssue = issue;
    this.router.navigate(['admin/issue-form']);
  }

  public deleteIssue(issue: IIssue): void {
    this.issueService.deleteIssue(issue.id).subscribe({
      next: () => {
        if (this.issues.length === 1 && this.queryParams.page > 1) {
          this.queryParams.page -= 1;
        }
        this.getIssues(this.queryParams);
        this.notificationService.success(
          this.translate.instant('components.admin.issues.delete-success'),
          'X'
        );
      },
      error: (response: any) => {
        const serverError = 500;
        if (response.status === serverError) {
          this.notificationService.error(
            this.translate.instant('common-errors.database-links'),
            'X'
          );
        } else {
          this.notificationService.error(
            this.translate.instant('common-errors.error-message'),
            'X'
          );
        }
      },
    });
  }

  public isEn(): boolean {
    return this.translate.currentLang === 'en';
  }
}
