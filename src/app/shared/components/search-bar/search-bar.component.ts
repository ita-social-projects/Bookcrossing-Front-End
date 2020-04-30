import { Component, OnInit } from '@angular/core';
import { BookParameters } from 'src/app/core/models/Pagination/bookParameters';
import { PaginationService } from 'src/app/core/services/pagination/pagination.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterParameters } from 'src/app/core/models/Pagination/FilterParameters';
import { SearchBarService } from 'src/app/core/services/searchBar/searchBar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  bookParams = new BookParameters;  
  searchQuery = {};
  searchTerm : string;
  currentTerm : string;
  
  constructor(  private routeActive: ActivatedRoute,
    private searchBarService: SearchBarService,
    private router: Router,
    private paginationService : PaginationService) { }  

  ngOnInit(): void {
    this.searchBarService.currentTerm.subscribe(term => {
      this.searchTerm = term;
      console.log(term);
     }
    )
  }
  resertSearch() {
    this.searchTerm = null;    
    this.navigateToBooks(null);
  }
  navigateToBooks(name : string){
    this.currentTerm = name;
    this.bookParams.page= 1;
    this.bookParams.pageSize = 8;
    this.bookParams.authorFilters = [];
    this.createFiltersForSearchTerm(name);
    this.router.navigate(['/books'],
    {
      relativeTo: this.routeActive,
      queryParams: this.paginationService.mapToQueryObjectBookParams(this.bookParams),
    });
  }
  private createFiltersForSearchTerm(term : string){
    if(term == null){
      return;
    }
    let temp = term.split(' ');
    this.bookParams.authorFilters[0] = <FilterParameters> {propertyName: "Book.Name", value: term}
    if(temp.length==1){
      this.bookParams.authorFilters[1] = <FilterParameters> {propertyName: "Author.LastName", value: temp[0]}
      this.bookParams.authorFilters[2] = <FilterParameters> {propertyName: "Author.FirstName", value: temp[0]}
    }else if(temp.length>1){
      this.bookParams.authorFilters[1] = <FilterParameters> {propertyName: "Author.FirstName", value: temp[0], operand: "And"}
      this.bookParams.authorFilters[2] = <FilterParameters> {propertyName: "Author.LastName", value: temp[temp.length-1]}
    }
  }
}
