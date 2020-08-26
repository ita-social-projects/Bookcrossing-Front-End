import { Component, OnInit } from '@angular/core';
import {StatisticsService} from '../../../core/services/statistics/statistics.service';
import {ICountersSet} from '../../../core/models/statistics/counters';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  public countersData: ICountersSet;

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.GetCounters();
  }

  public GetCounters(): void {
   this.statisticsService.getCounters()
     .subscribe((data) => {
       this.countersData = data;
   });
  }

}
