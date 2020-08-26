import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {statisticsUrl} from '../../../configs/api-endpoint.constants';
import {ICountersSet} from '../../models/statistics/counters';

@Injectable()
export class StatisticsService {

  constructor(private http: HttpClient) {}

  public getCounters() {
    return this.http.get<ICountersSet>(`${statisticsUrl}/counters`);
  }
}
