import { locationHomeUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILocationHome } from '../../models/locationHome';
import {Observable, Subject} from 'rxjs';
import {CompletePaginationParams} from '../../models/Pagination/completePaginationParameters';
import {IPage} from '../../models/page';
import {PaginationService} from '../pagination/pagination.service';
import {IMapHomeLocation} from '../../models/books-map/map-homeLocation';
import { ILocationHomePost } from '../../models/locationHomePost';

@Injectable()
export class LocationHomeService {
  private apiUrl: string = locationHomeUrl;

  constructor(
    private http: HttpClient
    ) {}

  // observable locationHome source
  private locationSubmitedSource = new Subject<ILocationHome>();
  private locationHomePost = new Subject<ILocationHomePost>();
  // observable location streams
  public locationHomePost$ = this.locationHomePost.asObservable();
  public locationSubmited$ = this.locationSubmitedSource.asObservable();

  submitLocationHomePost(location: ILocationHomePost): void {
    this.locationHomePost.next(location);
  }

  submitLocationHome(location: ILocationHome) {
    this.locationSubmitedSource.next(location);
  }

  getLocationHome() {
    return this.http.get<ILocationHome[]>(this.apiUrl);
  }

  getLocationHomeById(id: number) {
    return this.http.get<ILocationHome>(this.apiUrl + id);
  }

  postLocationHome(locationHome: ILocationHomePost) {
    return this.http.post<ILocationHomePost>(this.apiUrl, locationHome);
  }

  deleteLocationHome(id: number) {
    return this.http.delete(this.apiUrl + id);
  }

  editLocationHome(locationHome: ILocationHome) {
    return this.http.put(this.apiUrl, locationHome);
  }

  public getBooksQuantityOnLocations(): Observable<IMapHomeLocation[]> {
    return this.http.get<IMapHomeLocation[]>(this.apiUrl + 'locations');
  }
}
