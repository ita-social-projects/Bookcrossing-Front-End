import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {book} from '../models/book'

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http:HttpClient) { }

   getBooks():Observable<book[]>{
     return this.http.get<book[]>("https://localhost:44370/api/Books");
   }


}
