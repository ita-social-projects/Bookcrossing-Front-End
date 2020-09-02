import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {statisticsUrl} from '../../../configs/api-endpoint.constants';
import {ICountersSet} from '../../models/statistics/counters';
import {Observable} from 'rxjs';
import {IPieChartData} from '../../models/statistics/userDonationsData';
import {map} from 'rxjs/operators';

@Injectable()
export class StatisticsService {

  constructor(private http: HttpClient) {}

  public getCounters(): Observable<ICountersSet> {
    return this.http.get<ICountersSet>(`${statisticsUrl}/counters`);
  }

  public getUserDonations(days?: number): Observable<IPieChartData> {
    let params = new HttpParams();
    if (days) {
      params = params.set('amountOfDays', days.toString());
    }

    return this.http.get<IPieChartData>(`${statisticsUrl}/userDonations`, { params })
      .pipe(
        map((userDonationsData: any) => {
          const chartData = Object.keys(userDonationsData.data).map((key) => {
            return {name: key, value: userDonationsData.data[key]};
          });
          return {total: userDonationsData.total, chartData};
        })
      );
  }

  public getUserRead() {
    return this.http.get<IPieChartData>(`${statisticsUrl}/userRead`)
      .pipe(
        map((userReadData: any) => {
          const chartData = Object.keys(userReadData.data).map((key) => {
            return {name: key, value: userReadData.data[key]};
          });
          return {total: userReadData.total, chartData};
        })
      );
  }

  public getUserMostReadLanguages() {
    return this.http.get<IPieChartData>(`${statisticsUrl}/bookLanguages`)
      .pipe(
        map((userMostReadLanguagesData: any) => {
          const chartData = Object.keys(userMostReadLanguagesData.data).map((key) => {
            return {name: key, value: userMostReadLanguagesData.data[key]};
          });
          return {total: userMostReadLanguagesData.total, chartData};
        })
      );
  }
}
