import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAphorism } from '../../models/aphorism';
import { aphorismUrl } from 'src/app/configs/api-endpoint.constants';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class AphorismService {
    constructor(
    private http: HttpClient
    ) { }

    public getAphorism(isCurrent: boolean): Observable<IAphorism> {
      return this.http.get<IAphorism>(aphorismUrl + '/' + isCurrent);
    }
  }
