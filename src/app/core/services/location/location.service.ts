import { locationUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILocation } from '../../models/location';
import { Subject } from 'rxjs';

@Injectable()
export class LocationService {
  private apiUrl: string = locationUrl;

  constructor(private http: HttpClient) {}

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
