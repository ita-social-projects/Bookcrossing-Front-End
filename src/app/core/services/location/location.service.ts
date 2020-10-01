import {locationUrl} from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILocation } from '../../models/location';
import {Observable, Subject} from 'rxjs';
import {CompletePaginationParams} from '../../models/Pagination/completePaginationParameters';
import {IPage} from '../../models/page';
import {PaginationService} from '../pagination/pagination.service';

@Injectable()
export class LocationService {
  private apiUrl: string = locationUrl;

  constructor(private http: HttpClient, private pagination: PaginationService) {}

  // observable location source
  private locationSubmitedSource = new Subject<ILocation>();

  // observable location streams
  locationSubmited$ = this.locationSubmitedSource.asObservable();

  submitLocation(location: ILocation) {
    this.locationSubmitedSource.next(location);
  }

  // get all
  getLocation() {
    return this.http.get<ILocation[]>(this.apiUrl);
  }
  getLocationsPage(paginationParameters: CompletePaginationParams): Observable<IPage<ILocation>> {
    return this.pagination.getPaginatedPage<ILocation>(locationUrl + 'paginated', paginationParameters);
  }
  getLocationById(id: number) {
    return this.http.get<ILocation>(this.apiUrl + id);
  }

  postLocation(location: ILocation) {
    return this.http.post<ILocation>(this.apiUrl, location);
  }

  deleteLocation(id: number) {
    return this.http.delete(this.apiUrl + id);
  }

  editLocation(location: ILocation) {
    return this.http.put(this.apiUrl, location);
  }
}
