import { Component, OnInit } from '@angular/core';
import { BookQueryParams } from 'src/app/core/models/bookQueryParams';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchBarService } from 'src/app/core/services/searchBar/searchBar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  bookParams = new BookQueryParams;  
  searchQuery = {};
  searchTerm : string;
  
  constructor(  private routeActive: ActivatedRoute,
    private searchBarService: SearchBarService,
    private router: Router) { }  

  ngOnInit(): void {
    this.searchBarService.currentTerm.subscribe(term => {
      this.searchTerm = term;
     }
    )
  }
  clearInput(){
    setTimeout(() =>{
      
    if(!this.router.url.startsWith("/books"))
    this.searchTerm = null;
  },100)
  }
  trimInput() {
    this.searchTerm = this.searchTerm.trim();
  }
  resertSearch() {
    this.searchTerm = null;    
    this.navigateToBooks(null);
  }
  navigateToBooks(name : string){
    this.bookParams.searchTerm = name;
    this.router.navigate(['/books'],
    {
      relativeTo: this.routeActive,
      queryParams: this.bookParams,
      queryParamsHandling: 'merge'
    });
  }
}
