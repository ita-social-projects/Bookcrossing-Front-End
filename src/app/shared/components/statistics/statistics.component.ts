import {Component, OnInit} from '@angular/core';
import {StatisticsService} from '../../../core/services/statistics/statistics.service';
import {ICountersSet} from '../../../core/models/statistics/counters';
import {EChartOption} from 'echarts';
import {IPieChartData} from '../../../core/models/statistics/userDonationsData';
import {IGenre} from '../../../core/models/genre';
import {GenreService} from '../../../core/services/genre/genre';
import {NotificationService} from '../../../core/services/notification/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {LocationService} from '../../../core/services/location/location.service';
import {ILocation} from '../../../core/models/location';
import {IStatisticsData} from '../../../core/models/statistics/IStatisticsData';

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
  public readingStatisticsData: IStatisticsData;
  public donationStatisticsData: IStatisticsData;

  public genres: IGenre[];
  private locations: ILocation[];
  public cities: string[];
  public offices: string[];

  public donatedPieChartOption: EChartOption;
  public readPieChartOption: EChartOption;
  public languagesPieChartOption: EChartOption;
  public readingStatisticsChartOption: EChartOption;
  public donationStatisticsChartOption: EChartOption;

  public DateRangeEnumValues = DateRangeEnum;
  public selectedDonatedDataRange: DateRangeEnum = DateRangeEnum.AllTime;

  public readingFiltersChanged: boolean = false;
  public readingSelectedCities: string[];
  public readingSelectedOffices: string[];
  public readingSelectedGenres: number[];
  public readingFrom: Date;
  public readingTo: Date;

  public donationFiltersChanged: boolean = false;
  public donationSelectedCities: string[];
  public donationSelectedOffices: string[];
  public donationSelectedGenres: number[];
  public donationFrom: Date;
  public donationTo: Date;

  constructor(private statisticsService: StatisticsService,
              private genreService: GenreService,
              private notificationService: NotificationService,
              private translate: TranslateService,
              private locationService: LocationService) { }

  ngOnInit(): void {
    this.updateCounters();
    this.getAllGenres();
    this.getAllLocations();
    this.createGeneralStatisticsCharts();
    this.createPieCharts();
  }

  public updateCounters(): void {
   this.statisticsService.getCounters()
     .subscribe((data) => {
       this.countersData = data;
   });
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

  private async createGeneralStatisticsCharts(): Promise<void> {
    await this.getReadingStatisticsData();
    await this.getDonationStatisticsData();
    this.generateReadingChart();
    this.generateDonationChart();
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

  private generateReadingChart() {
    const titles = this.readingStatisticsData.data.map(el => el.name);
    const data: any = this.readingStatisticsData.data;
    data.forEach(e => {
      e.type = 'line';
      e.areaStyle = {};
      e.smooth = true;
    });

    this.readingStatisticsChartOption = {
      legend: {
        data: titles
      },
      grid: {
        right: 15,
        left: 45,
        bottom: 30,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.readingStatisticsData.periods
      },
      yAxis: {
        type: 'value'
      },
      series: data
    };
  }

  private generateDonationChart() {
    const titles = this.donationStatisticsData.data.map(el => el.name);
    const data: any = this.donationStatisticsData.data;
    data.forEach(e => {
      e.type = 'bar';
      e.barGap = 0;
      e.label = labelOption;
    });

    const labelOption = {
      show: true,
      position: 'insideBottom',
      distance: 15,
      align: 'left',
      verticalAlign: 'middle',
      rotate: 90,
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {
          textBorderColor: '#fff'
        }
      }
    };

    this.donationStatisticsChartOption = {
      color: ['#003366', '#006699', '#4cabce', '#e5323e'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: titles
      },
      grid: {
        right: 15,
        left: 45,
        bottom: 30,
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {show: false},
          data: this.donationStatisticsData.periods
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: data
    };
  }

  private getAllGenres(): void {
    this.genreService.getGenre().subscribe({
        next: (data: IGenre[]) => {
          this.genres = data;
        },
        error: () => {
          this.notificationService.error(this.translate
            .instant('An error has occurred, please try again later!'), 'X');
        }
      }
    );
  }

  private getAllLocations(): void {
    this.locationService.getLocation().subscribe({
      next: (data: ILocation[]) => {
        this.locations = data;
        this.getCities();
        this.getOffices();
      },
      error: () => {
        this.notificationService.error(this.translate
          .instant('An error has occurred, please try again later!'), 'X');
      }
    });
  }

  private getCities(): void {
    this.cities = this.locations
      .map((location) => location.city)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  private getOffices(): void {
    this.offices = this.locations
      .map((location) => location.officeName)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  private async getReadingStatisticsData(
    cities?: string[],
    offices?: string[],
    genres?: number[],
    from?: Date,
    to?: Date
  ): Promise<void> {
    await this.statisticsService.getReadingStatistics(cities, offices, genres, from, to)
      .toPromise()
      .then(
        (data: IStatisticsData) => {
          this.readingStatisticsData = data;
        }
      );
  }

  private async getDonationStatisticsData(
    cities?: string[],
    offices?: string[],
    genres?: number[],
    from?: Date,
    to?: Date
  ): Promise<void> {
    await this.statisticsService.getDonationStatistics(cities, offices, genres, from, to)
      .toPromise()
      .then(
        (data: IStatisticsData) => {
          this.donationStatisticsData = data;
        }
      );
  }

  public async onReadingStatisticsFilterChange(isOpened: boolean) {
    if (!isOpened && this.readingFiltersChanged) {
      this.readingFiltersChanged = false;
      let locations = this.locations;
      if (this.readingSelectedCities?.length > 0) {
        locations = locations.filter(location => this.readingSelectedCities.indexOf(location.city) !== -1);
      }

      this.offices = locations
        .map((location) => location.officeName)
        .filter((value, index, self) => self.indexOf(value) === index);

      await this.getReadingStatisticsData(
        this.readingSelectedCities,
        this.readingSelectedOffices,
        this.readingSelectedGenres,
        this.readingFrom,
        this.readingTo
      );

      this.generateReadingChart();
    }
  }

  public async onDonationStatisticsFilterChange(isOpened: boolean) {
    if (!isOpened && this.donationFiltersChanged) {
      this.donationFiltersChanged = false;
      let locations = this.locations;
      if (this.donationSelectedCities?.length > 0) {
        locations = locations.filter(location => this.donationSelectedCities.indexOf(location.city) !== -1);
      }

      this.offices = locations
        .map((location) => location.officeName)
        .filter((value, index, self) => self.indexOf(value) === index);

      await this.getDonationStatisticsData(
        this.donationSelectedCities,
        this.donationSelectedOffices,
        this.donationSelectedGenres,
        this.donationFrom,
        this.donationTo
      );

      this.generateDonationChart();
    }
  }
}
