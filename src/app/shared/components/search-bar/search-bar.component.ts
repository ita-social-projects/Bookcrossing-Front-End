import { Component, OnInit } from '@angular/core';
import { BookQueryParams } from 'src/app/core/models/bookQueryParams';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchBarService } from 'src/app/core/services/searchBar/searchBar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  bookParams = new BookQueryParams();
  searchQuery = {};
  searchTerm: string;

  constructor(
    private routeActive: ActivatedRoute,
    private searchBarService: SearchBarService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.searchBarService.currentTerm.subscribe((term) => {
      this.searchTerm = term;
    });
  }

  public clearInput(): void {
    setTimeout(() => {
      if (!this.router.url.startsWith('/books')) {
        this.searchTerm = null;
      }
    }, 100);
  }

  public trimInput(): void {
    this.searchTerm = this.searchTerm.trim();
  }

  public resertSearch(): void {
    this.searchTerm = null;
    this.navigateToBooks(null);
  }

  public navigateToBooks(name: string): void {
    this.bookParams.searchTerm = name;
    this.bookParams.pageSize = 8;
    this.router.navigate(['/books'], {
      relativeTo: this.routeActive,
      queryParams: this.bookParams,
      queryParamsHandling: !this.router.url.startsWith('/books') ? '' : 'merge',
    });
  }
}
