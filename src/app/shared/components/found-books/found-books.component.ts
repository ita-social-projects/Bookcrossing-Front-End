import { Component, OnInit } from '@angular/core';
import { IBook } from 'src/app/core/models/book';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BookQueryParams } from 'src/app/core/models/bookQueryParams';
import { environment } from 'src/environments/environment';
import { booksPage } from 'src/app/core/models/booksPage.enum';
import { HttpClient } from '@angular/common/http';
import { OuterServiceService } from 'src/app/core/services/outerService/outer-service.service';
import { IOuterBook } from 'src/app/core/models/outerBook';
import { IPage } from 'src/app/core/models/page';
import { CompletePaginationParams } from 'src/app/core/models/Pagination/completePaginationParameters';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { OuterBookQueryParams } from 'src/app/core/models/outerBookQueryParams';
import { BookService } from 'src/app/core/services/book/book.service';
import { AuthorService } from 'src/app/core/services/author/authors.service';

@Component({
  selector: 'app-found-books',
  templateUrl: './found-books.component.html',
  styleUrls: ['./found-books.component.scss'],
})
export class FoundBooksComponent implements OnInit {
  disabledButton = false;
  books: IBook[];
  booksPage: booksPage = booksPage.List;
  queryParams: OuterBookQueryParams = new OuterBookQueryParams();
  route = this.router.url;
  foundBooks: IPage<IOuterBook>;

  constructor(
    protected routeActive: ActivatedRoute,
    protected router: Router,
    protected outerService: OuterServiceService,
    protected notificationService: NotificationService,
    protected translate: TranslateService,
    protected bookService: BookService,
    protected authorService: AuthorService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      if (this.router.url !== '') {
        this.route = this.router.url;
      }
    });

    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = OuterBookQueryParams.mapFromQuery(params);
      this.getOuterBooks(this.queryParams);
    });
  }

  getOuterBooks(params: OuterBookQueryParams): void {
    this.outerService.getBooks(params).subscribe({
      next: (pageData) => {
        this.foundBooks = pageData;
      },
      error: () => {
        this.notificationService.error(
          this.translate.instant('common-errors.error-message'),
          'X'
        );
      },
    });
  }

  autoFill(bookId: number) {
    this.router.navigate(['/book'], { queryParams: { outerBookId: bookId } });
  }

  // Navigation
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  private changeUrl(): void {
    this.router.navigate(['.'], {
      relativeTo: this.routeActive,
      queryParams: this.queryParams.getQueryObject(),
    });
  }
}
