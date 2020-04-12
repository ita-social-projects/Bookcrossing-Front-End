import { Component, OnInit, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { IAuthor } from "src/app/core/models/author";
import {Router} from '@angular/router';
import {AuthorService} from "src/app/core/services/author/authors.service";
import { AuthorFormComponent } from '../author-form/author-form.component';
import { RefDirective } from '../../directives/ref.derictive';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  @ViewChild(RefDirective, {static: false}) refDir : RefDirective
  authors : IAuthor[];

  search : string = '';
  searchField : string = 'id';
  isReportTableToggled : boolean = false;

  editedAuthor : IAuthor;

  constructor(private router : Router, private authorService: AuthorService, private resolver: ComponentFactoryResolver) { }
  ngOnInit() {
    this.getAuthors();
  }
  
  toggleReportTable() : void {
    this.isReportTableToggled = !this.isReportTableToggled;
  }  
  showAddForm()
  {
    let newAuthor : IAuthor = {
      firstName: "",
      lastName: "",
      middleName: ""
    };
    this.showForm("Add Author",newAuthor)
  }
  showEditForm(author : IAuthor,index : number)
  {
    this.showForm("Edit Author",author,false,index)
  }  

  private showForm(title : string, author : IAuthor, isNewAuthor : boolean = true, index? : number){    
    let formFactory = this.resolver.resolveComponentFactory(AuthorFormComponent);
    let instance = this.refDir.containerRef.createComponent(formFactory).instance;
    instance.title = title;
    instance.author = author;
    instance.isNewAuthor = isNewAuthor
    instance.onCancel.subscribe(()=> this.refDir.containerRef.clear());
    if(isNewAuthor)
      instance.onAction.subscribe(author => this.addAuthor(author));
    else    
      instance.onAction.subscribe(author => this.editAuthor(author,index));
  }

  editAuthor(author: IAuthor, index : number): void {
    this.authorService.updateAuthor(author).subscribe({
      next: () => {
        this.authors[index] = author;
        console.log("Suc");
      },
      error: error => console.error(error)
    });
  };
  deleteAuthor(author: IAuthor): void {
    this.authorService.deleteAuthor(author.id)
      .subscribe({
        next: author => {
          this.authors = this.authors.filter(u => u !== author)
          console.log("Suc");
        },
        error: error => console.error(error)
      })
      this.authors = this.authors.filter(u => u !== author)
  };
  addAuthor(author: IAuthor): void {
    this.authorService.addAuthor(author).subscribe({
      next: author => {
        this.authors.unshift(author);
        console.log("Suc");
      },
      error: error => console.error(error)
    });
  };
  getAuthors() : void {
    this.authorService.getAuthors()
    .subscribe( {
      next: authorData => {
      this.authors = authorData;
    },
    error: error => console.error(error)
   });   
  }
}
