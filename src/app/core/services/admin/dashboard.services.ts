import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {dashboardUrl} from '../../../configs/api-endpoint.constants';
import {IAvailabilityData} from '../../models/dashboard/AvailabilityData';
import {IBookUserComparisonData} from '../../models/dashboard/BookUserComparisonData';
import {IDashboard} from '../../models/dashboard/Dashboard';
import {ILocationData} from '../../models/dashboard/LocationData';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<IDashboard> {
    return this.http.get<IDashboard>(dashboardUrl);
  }
  getLocationData(city?: string ) {
    let params = new HttpParams();
    if (city) {
      params = params.set('city', city);
    }
    return this.http.get<ILocationData>( dashboardUrl + `/location`, { params });
  }
  getAvailabilityData(city?: string) {
    let params = new HttpParams();
    if (city) {
      params = params.set('city', city);
    }
    return this.http.get<IAvailabilityData>( dashboardUrl + `/Availability`, { params });
  }
  getBookUserComparisonData(city?: string, byMonth = true) {
    let params = new HttpParams().set('byMonth', byMonth.toString());
    if (city) {
      params = params.set('city', city);
    }
    return this.http.get<IBookUserComparisonData>( dashboardUrl + `/BookUserComparison`, { params });
  }
}
