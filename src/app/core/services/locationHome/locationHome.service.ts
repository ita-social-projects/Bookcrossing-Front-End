import {locationHomeUrl} from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILocationHome } from '../../models/locationHome';
import {Observable, Subject} from 'rxjs';
import {CompletePaginationParams} from '../../models/Pagination/completePaginationParameters';
import {IPage} from '../../models/page';
import {PaginationService} from '../pagination/pagination.service';

@Injectable()
export class LocationHomeService {
  private apiUrl: string = locationHomeUrl;

  constructor(private http: HttpClient, private pagination: PaginationService) {}

  // observable locationHome source
  private locationSubmitedSource = new Subject<ILocationHome>();

  // observable location streams
  locationSubmited$ = this.locationSubmitedSource.asObservable();

  submitLocationHome(location: ILocationHome) {
    this.locationSubmitedSource.next(location);
  }

  // get all
  getLocationHome() {
    return this.http.get<ILocationHome[]>(this.apiUrl);
  }
  getLocationsHomePage(paginationParameters: CompletePaginationParams): Observable<IPage<ILocationHome>> {
    return this.pagination.getPaginatedPage<ILocationHome>(locationHomeUrl + 'paginated', paginationParameters);
  }
  getLocationHomeById(id: number) {
    return this.http.get<ILocationHome>(this.apiUrl + id);
  }

  postLocationHome(locationHome: ILocationHome) {
    return this.http.post<ILocationHome>(this.apiUrl, locationHome);
  }

  deleteLocationHome(id: number) {
    return this.http.delete(this.apiUrl + id);
  }

  editLocationHome(locationHome: ILocationHome) {
    return this.http.put(this.apiUrl, locationHome);
  }
}
