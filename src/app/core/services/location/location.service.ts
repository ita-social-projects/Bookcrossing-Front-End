import { locationUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILocation } from '../../models/location';

@Injectable()
export class LocationService {
  private apiUrl: string = locationUrl;

  constructor(private http: HttpClient) {}

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

}
