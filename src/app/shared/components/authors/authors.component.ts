import { Component, OnInit, ViewChild, ElementRef, ComponentFactoryResolver, Output, EventEmitter, Input } from '@angular/core';
import { IAuthor } from "src/app/core/models/author";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AuthorService} from "src/app/core/services/author/authors.service";
import { AuthorFormComponent } from '../author-form/author-form.component';
import { RefDirective } from '../../directives/ref.derictive';
import { PaginationParameters } from 'src/app/core/models/paginationParameters';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  @ViewChild(RefDirective, {static: false}) refDir : RefDirective

  @Output() selectRow = new EventEmitter<IAuthor>();
  @Input() isAdmin: boolean = true;
  authors : IAuthor[];
  queryParams : PaginationParameters = new PaginationParameters();
  searchText : string;
  totalSize : number;  
  isReportTableToggled : boolean = false;

  constructor(
    private routeActive : ActivatedRoute,
    private router : Router, 
    private authorService: AuthorService, 
    private resolver: ComponentFactoryResolver
    ) { }


  ngOnInit() {
    this.onAuthorEditted();
    this.routeActive.queryParams.subscribe((params : Params) => {
      this.mapParams(params,1,10,"lastname");      
      this.searchText = params.searchQuery;
      this.getAuthors(this.queryParams);
    })
  }; 

  private onAuthorEditted() {
    this.authorService.authorEdited$.subscribe((author) => {
      let editedAuthor = this.authors.find((x) => x.id === author.id);
      if (editedAuthor) {
        const index = this.authors.indexOf(editedAuthor);
        this.authors[index] = author;
      }
    });
  }
  //Pagination/URL
  search() : void{
    if(this.queryParams.searchQuery == this.searchText){
      return;
    }
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
    this.queryParams.searchQuery = this.searchText;
    this.changeUrl(this.queryParams);
  }
  changeSort(selectedHeader : string){  
    this.queryParams.orderByField = selectedHeader; 
    this.queryParams.searchField = selectedHeader;
    this.queryParams.orderByAscending = !this.queryParams.orderByAscending;
    this.changeUrl(this.queryParams);
  }
  pageChanged(currentPage : number) : void{      
      this.queryParams.page = currentPage; 
      this.queryParams.firstRequest = false; 
      this.changeUrl(this.queryParams);
  }
  private changeUrl(params : PaginationParameters)  : void{
    this.router.navigate(['.'], 
      {
        relativeTo: this.routeActive,
        queryParams: params
      });
  }  
  private mapParams(params: Params, defaultPage : number = 1, defultPageSize : number = 10, defaultField? : string ) {
    this.queryParams.page = params.page ? +params.page : defaultPage;   
    this.queryParams.pageSize = params.pageSize ? +params.pageSize : defultPageSize;
    this.queryParams.searchQuery = params.searchQuery ? params.searchQuery : null; 
    this.queryParams.searchField = params.searchField ? params.searchField : defaultField;
    this.queryParams.orderByAscending = params.orderByAscending ? params.orderByAscending : true;
    this.queryParams.orderByField = params.orderByField ? params.orderByField : defaultField;
  } 

  //Form
  showEditForm(author : IAuthor,index : number){    
    let formFactory = this.resolver.resolveComponentFactory(AuthorFormComponent);
    let instance = this.refDir.containerRef.createComponent(formFactory).instance;
    instance.title = "Edit Author";
    instance.author = author;
    instance.onCancel.subscribe(()=> this.refDir.containerRef.clear());
  };

  //Get
  getAuthors(params : PaginationParameters) : void {      
    this.authorService.getAuthorsPage(params)
    .subscribe( {
      next: pageData => {
      this.authors = pageData.page;
      if(pageData.totalCount){
        this.totalSize = pageData.totalCount;        
      }
    },
    error: error => {
      alert("An error has occured, please try again");
    }
   });   
  };

  onSelectRow(author){
    this.selectRow.emit(author);
  }
}
