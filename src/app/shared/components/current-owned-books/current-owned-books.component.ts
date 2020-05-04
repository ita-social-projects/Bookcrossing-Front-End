import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBook} from '../../../core/models/book';
import {BookQueryParams} from '../../../core/models/bookQueryParams';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BookService} from '../../../core/services/book/book.service';
import {SearchBarService} from '../../../core/services/searchBar/searchBar.service';
import {IUser} from '../../../core/models/user';

@Component({
  selector: 'app-current-owned-books',
  templateUrl: './current-owned-books.component.html',
  styleUrls: ['./current-owned-books.component.scss']
})

export class CurrentOwnedBooksComponent implements OnInit, OnDestroy {

  books: IBook[];
  user: IUser;
  totalSize: number;
  queryParams: BookQueryParams = new BookQueryParams;

  selectedGenres: number[];


  constructor(private routeActive: ActivatedRoute,
              private router: Router,
              private bookService: BookService,
              private searchBarService: SearchBarService,
  ) { }

  ngOnInit(): void {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 5)
      this.populateDataFromQuery();
      this.getBooks(this.queryParams);
    });
  }
  onFilterChange(filterChanged: boolean) {
    this.queryParams.genres = this.selectedGenres
    if (filterChanged) {
      this.resetPageIndex()
      this.changeUrl();
    }
  }
  private populateDataFromQuery() {
    if (this.queryParams.searchTerm) {
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm)
    }
    if (typeof this.queryParams.showAvailable === 'undefined') {
      this.queryParams.showAvailable = true;
    }
    if (this.queryParams.genres) {
      let genres: number[];
      if (Array.isArray(this.queryParams.genres)) {
        genres = this.queryParams.genres.map(v => +v);
      }
      else {
        genres = [+this.queryParams.genres];
      }
      this.selectedGenres =  genres;
    }
  }

  //Navigation
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
  }
  private resetPageIndex(): void {
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
  }
  private changeUrl(): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.queryParams,
      });
  }


  //get
  getBooks(params: BookQueryParams): void {
    this.bookService.getCurrentOwnedBooks(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          if (pageData.totalCount) {
            this.totalSize = pageData.totalCount;
          }
        },
        error: error => {
          alert('An error has occured, please try again');
        }
      });
  }
  makeRequest(bookId: number): void {
    alert(bookId);
  }

  ngOnDestroy() {
    this.searchBarService.changeSearchTerm(null);
  }
}
