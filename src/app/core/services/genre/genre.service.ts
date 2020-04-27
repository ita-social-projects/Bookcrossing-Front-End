import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IGenre} from '../../models/genre';
import {genreUrl} from '../../../configs/api-endpoint.constants';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private http: HttpClient) { }

  getGenres(): Observable<IGenre[]> {
    return this.http.get<IGenre[]>(genreUrl);
  }

  getGenreById(genreId: number) {
    return this.http.get<IGenre[]>( genreUrl + `/${genreId}`);
  }

  addGenre(genre: IGenre) {
    return this.http.post<IGenre>(genreUrl, genre);
  }

  deleteGenre(genreId: number) {
    return this.http.delete<IGenre>(genreUrl + `/${genreId}`);
  }

  updateGenre(genre: IGenre) {
    return this.http.put<IGenre>(genreUrl, genre);
  }
}
