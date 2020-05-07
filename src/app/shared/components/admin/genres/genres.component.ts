import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {RefDirective} from '../../../directives/ref.derictive';
import {CompletePaginationParams} from '../../../../core/models/completePaginationParameters';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FilterParameters} from '../../../../core/models/Pagination/filterParameters';
import {SortParameters} from '../../../../core/models/Pagination/sortParameters';
import {IGenre} from '../../../../core/models/genre';
import {GenreService} from '../../../../core/services/genre/genre.service';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})
export class GenresComponent implements OnInit {

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  genres: IGenre[];
  genresDisplayColumns: string[] = ['#', 'Genre'];
  genresProperties: string[] = ['id', 'name'];
  queryParams: CompletePaginationParams = new CompletePaginationParams();
  searchText: string;
  searchField = 'lastName';
  totalSize: number;


  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private genreService: GenreService,
    private resolver: ComponentFactoryResolver
  ) { }


  ngOnInit() {
    // this.onAuthorEdited();
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.searchText = this.queryParams?.filters[0]?.value;
      this.getGenres(this.queryParams);
    });
  }

  // private onAuthorEdited() {
  //   this.authorService.authorEdited$.subscribe((author) => {
  //     const editedAuthor = this.authors.find((x) => x.id === author.id);
  //     if (editedAuthor) {
  //       const index = this.authors.indexOf(editedAuthor);
  //       this.authors[index] = author;
  //     }
  //   });
  // }
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
  // Form
  // showAddForm() {
  //   const newAuthor: IAuthor = {
  //     firstName: '',
  //     lastName: '',
  //     middleName: ''
  //   };
  //   this.showForm(newAuthor, 'Add Author');
  // }
  // showEditForm(author: IAuthor) {
  //   this.showForm(author, 'Edit Author');
  // }
  // showForm(author: IAuthor, title: string) {
  //   const formFactory = this.resolver.resolveComponentFactory(AuthorFormComponent);
  //   const instance = this.refDir.containerRef.createComponent(formFactory).instance;
  //   instance.title = title;
  //   instance.author = author;
  //   instance.onCancel.subscribe(() => this.refDir.containerRef.clear());
  // }

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
        error: error => {
          alert('An error has occured, please try again');
        }
      });
  }
}
