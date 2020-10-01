import { genreUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IGenre } from '../../models/genre';


@Injectable()
export class GenreService {
  private apiUrl: string = genreUrl;

  constructor(private http: HttpClient) {}

  // get all
  getGenre() {
    return this.http.get<IGenre[]>(this.apiUrl);
  }

  getGenreById(id: number) {
    return this.http.get<IGenre>(this.apiUrl + id);
  }

  postGenre(genre: IGenre) {
    return this.http.post<IGenre>(this.apiUrl, genre);
  }

  deleteGenre(id: number) {
    return this.http.delete(this.apiUrl + id);
  }

  editGenre(genre: IGenre) {
    return this.http.put(this.apiUrl, genre);
  }
}
