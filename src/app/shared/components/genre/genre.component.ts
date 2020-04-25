import { Component, OnInit } from '@angular/core';
import {GenreService} from '../../../core/services/genre/genre.service';
import {IGenre} from '../../../core/models/genre';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {

  constructor(private genreService: GenreService) { }

  genres: IGenre[];
  genre: IGenre;

  ngOnInit(): void {
    this.genreService.getGenres()
      .subscribe( genres_ => { this.genres = genres_; });
  }

  editGenre(genre: IGenre, index: number): void {
    this.genreService.updateGenre(genre).subscribe({
      next: () => {
        this.genres[index] = genre;
      }
    });
  }

  deleteGenre(genre: IGenre): void {
    this.genreService.deleteGenre(genre.id)
      .subscribe({
        next: genre => {
          this.genres = this.genres.filter(g => g !== genre);
        }
      })
    this.genres = this.genres.filter(g => g !== genre);
  }

  addGenre(author: IGenre): void {
    this.genreService.addGenre(author).subscribe({
      next: genre => {
        this.genres.unshift(genre);
      }
    });
  }

}
