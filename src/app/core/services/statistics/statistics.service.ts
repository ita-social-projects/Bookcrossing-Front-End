import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {statisticsUrl} from '../../../configs/api-endpoint.constants';
import {ICountersSet} from '../../models/statistics/counters';
import {Observable} from 'rxjs';
import {IPieChartData} from '../../models/statistics/userDonationsData';
import {map} from 'rxjs/operators';
import {IStatisticsData} from '../../models/statistics/IStatisticsData';

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

  public getReadingStatistics(cities: string[], offices: string[], genres: number[], from?: Date, to?: Date): Observable<IStatisticsData> {
    let params = new HttpParams();
    if (cities?.length > 0) {
      for (const city of cities) {
        params = params.append('cities', city);
      }
    }

    if (offices?.length > 0) {
      for (const office of offices) {
        params = params.append('offices', office);
      }
    }

    if (genres?.length > 0) {
      for (const id of genres) {
        params = params.append('genres', id.toString());
      }
    }

    if (from) {
      params = params.set('from', from.toLocaleDateString());
    }

    if (to) {
      params = params.set('to', to.toLocaleDateString());
    }

    return this.http.get<IStatisticsData>(`${statisticsUrl}/reading`, {params})
      .pipe(
        map((readingData: any) => {
          const lineChartData = Object.keys(readingData.data).map((key) => {
            return {name: key, data: readingData.data[key]};
          });
          const obj: IStatisticsData = {
            data: lineChartData,
            periods: readingData.periods
          };

          return obj;
        })
      );
  }

  public getDonationStatistics(cities: string[], offices: string[], genres: number[], from?: Date, to?: Date): Observable<IStatisticsData> {
    let params = new HttpParams();
    if (cities?.length > 0) {
      for (const city of cities) {
        params = params.append('cities', city);
      }
    }

    if (offices?.length > 0) {
      for (const office of offices) {
        params = params.append('offices', office);
      }
    }

    if (genres?.length > 0) {
      for (const id of genres) {
        params = params.append('genres', id.toString());
      }
    }

    if (from) {
      params = params.set('from', from.toLocaleDateString());
    }

    if (to) {
      params = params.set('to', to.toLocaleDateString());
    }

    return this.http.get<IStatisticsData>(`${statisticsUrl}/donation`, {params})
      .pipe(
        map((readingData: any) => {
          const lineChartData = Object.keys(readingData.data).map((key) => {
            return {name: key, data: readingData.data[key]};
          });
          const obj: IStatisticsData = {
            data: lineChartData,
            periods: readingData.periods
          };

          return obj;
        })
      );
  }
}
