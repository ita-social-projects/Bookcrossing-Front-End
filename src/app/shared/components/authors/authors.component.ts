import { Component, OnInit, ViewChild, ComponentFactoryResolver} from '@angular/core';
import { IAuthor } from "src/app/core/models/author";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AuthorService} from "src/app/core/services/author/authors.service";
import { AuthorFormComponent } from '../author-form/author-form.component';
import { RefDirective } from '../../directives/ref.derictive';
import { CompletePaginationParams } from 'src/app/core/models/completePaginationParameters';
import { SortParameters } from 'src/app/core/models/Pagination/SortParameters';
import { FilterParameters } from 'src/app/core/models/Pagination/FilterParameters';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  @ViewChild(RefDirective, {static: false}) refDir : RefDirective

  authors : IAuthor[];
  queryParams : CompletePaginationParams = new CompletePaginationParams();
  searchText : string;
  searchField : string = "lastname";
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
      this.queryParams = this.queryParams.mapFromQuery(params)
      this.searchText = this.queryParams?.filters[0]?.value;
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
    if(this.queryParams?.filters[0]?.value == this.searchText){
      return
    }
    this.queryParams.page = 1;
    this.queryParams.filters = [];
    this.queryParams.filters[0] = <FilterParameters> {propertyName:this.searchField, value: this.searchText}
    this.changeUrl();
  }
  changeSort(selectedHeader : string){
    this.queryParams.sort = <SortParameters> {orderByField:selectedHeader, orderByAscending: !this.queryParams.sort.orderByAscending}
    this.changeUrl();
  }
  pageChanged(currentPage : number) : void{
      this.queryParams.page = currentPage;
      this.queryParams.firstRequest = false;
      this.changeUrl();
  }
  private changeUrl()  : void{
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.queryParams.getQueryObject()
      });
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
  getAuthors(params : CompletePaginationParams) : void {
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
}
