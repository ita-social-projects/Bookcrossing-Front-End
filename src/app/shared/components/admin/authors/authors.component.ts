import { Component, OnInit, ViewChild, ComponentFactoryResolver} from '@angular/core';
import { IAuthor } from 'src/app/core/models/author';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AuthorService} from 'src/app/core/services/author/authors.service';
import { AuthorFormComponent } from '../author-form/author-form.component';
import { RefDirective } from '../../../directives/ref.derictive';
import { CompletePaginationParams } from 'src/app/core/models/completePaginationParameters';
import { SortParameters } from 'src/app/core/models/Pagination/sortParameters';
import { FilterParameters } from 'src/app/core/models/Pagination/filterParameters';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  authors: IAuthor[];
  authorDisplayColumns: string[] = ['#', 'First Name', 'Last Name', 'Middle Name'];
  authorProperties: string[] = ['id', 'firstName', 'lastName', 'middleName'];
  queryParams: CompletePaginationParams = new CompletePaginationParams();
  searchText: string;
  searchField = 'lastName';
  totalSize: number;

  selectedRows = [];

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService,
    private resolver: ComponentFactoryResolver
    ) { }


  ngOnInit() {
    this.onAuthorEdited();
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.searchText = this.queryParams?.filters[0]?.value;
      this.getAuthors(this.queryParams);
    });
  }

  private onAuthorEdited() {
    this.authorService.authorEdited$.subscribe((author) => {
      const editedAuthor = this.authors.find((x) => x.id === author.id);
      if (editedAuthor) {
        const index = this.authors.indexOf(editedAuthor);
        this.authors[index] = author;
      }
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

  mergeClear() {
    this.selectedRows = [];
  }
  merge() {
    console.log(this.selectedRows);
  }

  // Form
  showAddForm() {
    const newAuthor: IAuthor = {
      firstName: '',
      lastName: '',
      middleName: ''
    };
    this.showForm(newAuthor, 'Add Author');
  }
  showEditForm(author: IAuthor) {
    this.showForm(author, 'Edit Author');
  }
  showForm(author: IAuthor, title: string) {
    const formFactory = this.resolver.resolveComponentFactory(AuthorFormComponent);
    const instance = this.refDir.containerRef.createComponent(formFactory).instance;
    instance.title = title;
    instance.author = author;
    instance.onCancel.subscribe(() => this.refDir.containerRef.clear());
  }

  // Get
  getAuthors(params: CompletePaginationParams): void {
    this.authorService.getAuthorsPage(params)
    .subscribe( {
      next: pageData => {
      this.authors = pageData.page;
      if (pageData.totalCount) {
        this.totalSize = pageData.totalCount;
      }
    },
    error: () => {
      this.notificationService.warn(this.translate
        .instant('Something went wrong!'), 'X');
    }
   });
  }
}
