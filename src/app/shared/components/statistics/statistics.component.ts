import { Component, OnInit } from '@angular/core';
import {StatisticsService} from '../../../core/services/statistics/statistics.service';
import {ICountersSet} from '../../../core/models/statistics/counters';
import { EChartOption, Echart } from 'echarts';
import {IPieChartData} from '../../../core/models/statistics/userDonationsData';

enum DateRangeEnum {
  Week = 7,
  Month = 30,
  HalfYear = 6,
  Year = 12,
  AllTime
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  public countersData: ICountersSet;
  public donatedPieData: IPieChartData;
  public readPieData: IPieChartData;
  public languagesPieData: IPieChartData;

  public donatedPieChartOption: EChartOption;
  public readPieChartOption: EChartOption;
  public languagesPieChartOption: EChartOption;

  public DateRangeEnumValues = DateRangeEnum;
  public selectedDonatedDataRange: DateRangeEnum = DateRangeEnum.AllTime;

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.updateCounters();
    this.createPieCharts();
  }

  public updateCounters(): void {
   this.statisticsService.getCounters()
     .subscribe((data) => {
       this.countersData = data;
   });
  }

  private async createPieCharts(): Promise<void> {
    await this.getPieChartsData();
    this.generateDonatedPieChart();
    this.generateReadPieChart();
    this.generateLanguagesPieChart();
  }

  private async getPieChartsData(): Promise<void> {
    await this.getUserDonationsData();
    await this.getUserReadData();
    await this.getUserMostReadLanguagesData();
  }

  private async getUserDonationsData(days?: number): Promise<void> {
    await this.statisticsService.getUserDonations(days)
      .toPromise()
      .then(data => {
          this.donatedPieData = data;
        }
      );
  }

  private async getUserReadData(): Promise<void> {
    await this.statisticsService.getUserRead()
      .toPromise()
      .then(data => {
          this.readPieData = data;
        }
      );
  }

  private async getUserMostReadLanguagesData(): Promise<void> {
    await this.statisticsService.getUserMostReadLanguages()
      .toPromise()
      .then(data => {
          this.languagesPieData = data;
        }
      );
  }

  private generateDonatedPieChart(): void {
    const titles = this.donatedPieData.chartData.map(data => data.name);
    const verticalLimit = 6;
    const orientation = this.donatedPieData.chartData.length > verticalLimit ? 'horizontal' : 'vertical';

    this.donatedPieChartOption = {
      legend: {
        orient: orientation,
        left: 0,
        bottom: 0,
        data: titles,
        icon: 'rect',
      },
      series: [
        {
          name: 'Donates',
          type: 'pie',
          radius: ['50%', '70%'],
          selectedMode: 'single',
          hoverOffset: 2,
          center: ['50%', '30%'],
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '26',
              fontWeight: 'bold',
              formatter: ['{value|{c}}', '{selectedGenre|{b}}', '{percentage| {d}%}'].join('\n'),
              padding: [35, 0, 0, 0],
              rich: {
                value: { color: '#1D70B8', fontSize: 35 },
                selectedGenre: { fontSize: 20 },
                percentage: { color: '#1D70B8', fontSize: 16 }
              }
            },
          },
          data: this.donatedPieData.chartData
        }
      ],
    };
  }

  private generateReadPieChart() {
    const titles = this.readPieData.chartData.map(data => data.name);
    const verticalLimit = 6;
    const orientation = this.readPieData.chartData.length > verticalLimit ? 'horizontal' : 'vertical';

    this.readPieChartOption = {
      legend: {
        orient: orientation,
        left: 0,
        bottom: 0,
        data: titles,
        icon: 'rect',
      },
      series: [
        {
          name: 'Read',
          type: 'pie',
          radius: ['50%', '70%'],
          selectedMode: 'single',
          hoverOffset: 2,
          center: ['50%', '30%'],
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '26',
              fontWeight: 'bold',
              formatter: ['{value|{c}}', '{selectedGenre|{b}}', '{percentage| {d}%}'].join('\n'),
              padding: [35, 0, 0, 0],
              rich: {
                value: { color: '#1D70B8', fontSize: 35 },
                selectedGenre: { fontSize: 20 },
                percentage: { color: '#1D70B8', fontSize: 16 }
              }
            },
          },
          data: this.readPieData.chartData
        }
      ],
    };
  }

  private generateLanguagesPieChart() {
    const titles = this.languagesPieData.chartData.map(data => data.name);
    const verticalLimit = 6;
    const orientation = this.languagesPieData.chartData.length > verticalLimit ? 'horizontal' : 'vertical';

    this.languagesPieChartOption = {
      legend: {
        orient: orientation,
        left: 0,
        bottom: 0,
        data: titles,
        icon: 'rect',
      },
      series: [
        {
          name: 'Donates',
          type: 'pie',
          radius: ['50%', '70%'],
          selectedMode: 'single',
          hoverOffset: 2,
          center: ['50%', '30%'],
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '26',
              fontWeight: 'bold',
              formatter: ['{value|{c}}', '{selectedGenre|{b}}', '{percentage| {d}%}'].join('\n'),
              padding: [35, 0, 0, 0],
              rich: {
                value: { color: '#1D70B8', fontSize: 35 },
                selectedGenre: { fontSize: 20 },
                percentage: { color: '#1D70B8', fontSize: 16 }
              }
            },
          },
          data: this.languagesPieData.chartData
        }
      ],
    };
  }

  public async onDonatedPieDateRangeChange(): Promise<void> {
    switch (this.selectedDonatedDataRange) {
      case DateRangeEnum.AllTime:
        await this.getUserDonationsData();
        break;
      case DateRangeEnum.Year:
      case DateRangeEnum.HalfYear:
        const monthes: number = this.selectedDonatedDataRange;
        await this.getUserDonationsData(monthes * 30);
        break;
      case DateRangeEnum.Month:
      case DateRangeEnum.Week:
        await this.getUserDonationsData(this.selectedDonatedDataRange);
        break;
    }
    this.generateDonatedPieChart();
  }
}
