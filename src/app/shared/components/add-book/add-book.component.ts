import { Component, OnInit } from "@angular/core";
import { IGenre } from "src/app/core/models/genre";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IBook } from "src/app/core/models/book";
import { IAuthor } from "src/app/core/models/author";
import { BookService } from "src/app/core/services/book/book.service";
import { GenreService } from "src/app/core/services/genre/genre";
import { AuthorService } from "src/app/core/services/author/authors.service";
import { SubscriptionLike } from 'rxjs';
import { Router } from '@angular/router';
import { IBookPost } from 'src/app/core/models/bookPost';

@Component({
  selector: "app-add-book",
  templateUrl: "./add-book.component.html",
  styleUrls: ["./add-book.component.scss"],
})
export class AddBookComponent implements OnInit {
  constructor(
    private bookService: BookService,
    private genreService: GenreService,
    private authorService: AuthorService,
    private router: Router
  ) {}

  addBookForm: FormGroup;

  userId: number = 1;
  genres: IGenre[] = [];
  selectedAuthors: IAuthor[] = [];
  authors: IAuthor[] = [];
  selectedFile = null;
  authorsSubscription: SubscriptionLike;

  ngOnInit(): void {
    this.buildForm();
    this.getAllGenres();
    this.authorsSubscription = this.addBookForm.get("author").valueChanges.subscribe((input) => {
      this.filterAuthors(input);
    });
  }

  filterAuthors(input: string) {
    if (input?.length <= 2) {
      this.authors = [];
    }
    if (input?.length === 2) {
      this.authorService.getFilteredAuthors(input).subscribe(
        (data) => {
          this.authors = data;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  buildForm() {
    this.addBookForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      genres: new FormControl(null, Validators.required),
      publisher: new FormControl(null),
      author: new FormControl(null),
      description: new FormControl(null)
    });
  }

  onSubmit() {
    // parse selected genres
    const selectedGenres: IGenre[] = [];
    for (let i = 0; i < this.addBookForm.get("genres").value?.length; i++) {
      const id = this.addBookForm.get("genres").value[i];
      selectedGenres.push({ id: id, name: this.getGenreById(id) });
    }

    const newAuthor: string = this.addBookForm.get("author").value;
    if(newAuthor){
      console.log("new Author")
      this.addNewAuthor(newAuthor);
    }


    let book: IBookPost = {
      name: this.addBookForm.get("title").value,
      authors: this.selectedAuthors,
      genres: selectedGenres,
      publisher: this.addBookForm.get("publisher").value,
      notice: this.addBookForm.get("description").value,
      available: true,
      userId: this.userId,
    };


    if (this.selectedFile) {
      book.image = this.selectedFile;
    }

    this.bookService.postBook(book).subscribe(
      (data: IBook) => {
        alert("Successfully added");
        this.goToPage('books');
      },
      (error) => {
        console.log(error);
      }
    );

    // this.goToPage('books');
    this.selectedAuthors = [];
    this.addBookForm.reset();

    // after submmit subscription stops work 
    this.authorsSubscription.unsubscribe();
    this.authorsSubscription = this.addBookForm.get("author").valueChanges.subscribe((input) => {
      this.filterAuthors(input);
    });

  }

  getGenreById(id: number) {
    return this.genres ? this.genres.find((genre) => genre.id == id)?.name : "";
  }

  getAllGenres() {
    this.genreService.getGenre().subscribe(
      (data) => {
        this.genres = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDeleteAuthor(author: IAuthor) {
    const index = this.selectedAuthors.indexOf(author);
    if (index > -1) {
      this.selectedAuthors.splice(index, 1);
    }
  }

  addAuthor(author) {
    const index = this.selectedAuthors.findIndex((elem) => {
      return (
        elem.firstName.toLowerCase() === author.firstName.toLowerCase() &&
        elem.middleName.toLowerCase() === author.middleName.toLowerCase() &&
        elem.lastName.toLowerCase() === author.lastName.toLowerCase()
      );
    });
    if (index < 0) {
      this.selectedAuthors.push(author);
    }
  }

  addNewAuthor(newAuthor: string) {
    const author = this.parseAuthorString(newAuthor);
    this.addAuthor(author);
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  // parses string and returns IAuthor object
  parseAuthorString(input: string): IAuthor {
    console.log(input);
    input = input.trim();
    const words = input.split(/\s+/g);
    const firstName = words[0];
    let lastName = null;
    let middleName = null;

    // if input string contains > 3 words - second is middleName
    if (words.length > 2) {
      middleName = words[1];
      lastName = words[2];
    } else {
      lastName = words[1];
    }
    const author: IAuthor = {
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
    };
    console.log(author);
    return author;
  }

  onAuthorSelect(event) {
    console.log(event);
    this.addBookForm.get("author").setValue("");
    this.addAuthor(event.option.value);
  }

  // redirecting method
  goToPage(pageName:string){
    this.router.navigate([`${pageName}`]);
  }
}
