import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';
import {TranslateService} from '@ngx-translate/core';
import {DashboardService} from '../../../../core/services/admin/dashboard.services';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {IAvailabilityData} from '../../../../core/models/dashboard/AvailabilityData';
import {ILocationData} from '../../../../core/models/dashboard/LocationData';
import {IBookUserComparisonData, IDateTimeValue} from '../../../../core/models/dashboard/BookUserComparisonData';
import {DatePipe} from '@angular/common';

enum DateRangeEnum {
  Week = 7,
  Month = 30,
  HalfYear = 6,
  Year = 12,
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedLocation = 'All';
  locations: string[];
  locationData: ILocationData;
  selectedDataRange: DateRangeEnum = DateRangeEnum.Year;
  DateRangeEnumValues = DateRangeEnum;

  pieChart: Chart;
  barChart: Chart;
  lineChart: Chart;

  private pieChartLabels: string[];
  private pieChartTitle: string;
  private lineChartLabels: string[];
  private lineChartDataLabels = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];

  private languageChange: any;
  private translateSubscription: any;

  private comparisonData: IBookUserComparisonData = { booksRegistered: [],  usersRegistered: []};

  private pieTotalData = [0, 0, 0, 0];
  private pieChartCityData: any;
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private dashboardService: DashboardService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.createLineChart();
    this.createBarChart();
    this.createPieChart();
    this.getChartLabels();
    this.getChartData();
    this.languageChange = this.translate.onLangChange.subscribe(() => this.getChartLabels());
  }

  // Charts Data
  public onLocationChange(city?: string) {
    if (city === 'All') {
      city = undefined;
    }
    this.dashboardService.getLocationData(city).subscribe({
      next: data => {
        this.locationData = data;
      },
      error: () => {
      this.notificationService.error(this.translate
        .instant('common-errors.error-message'), 'X');
    }
    });
    this.onDateRangeChange(city);

  }

  public onDateRangeChange(city?: string) {
    if (city === 'All') {
      city = undefined;
    }
    const getMonths = this.selectedDataRange === DateRangeEnum.Year || this.selectedDataRange === DateRangeEnum.HalfYear;
    this.dashboardService.getBookUserComparisonData(city, getMonths).subscribe({
      next: data => {
        this.comparisonData = data;
        this.setDateRange();
      },
      error: () => {
        this.notificationService.error(this.translate
          .instant('common-errors.error-message'), 'X');
      }
    });
  }

  private getChartData() {
    this.dashboardService.getDashboardData()
      .subscribe({
        next: data => {
          console.log(data);
          this.locations = data.cities;
          this.locationData = data.locationData;
          this.pieChartCityData = data.availabilityData;
          this.comparisonData = data.bookUserComparisonData;
          // barChart
          this.barChart.data.labels = [];
          this.barChart.data.datasets[0].data = [];
          for (const [key, v] of Object.entries(data.availabilityData)) {
            let total = 0;
            for (const value of Object.values(v)) {
              total += +value;
            }
            this.barChart.data.labels.push(key);
            this.barChart.data.datasets[0].data.push(total);
          }
          this.barChart.update();
          this.setDateRange();

        },
        error: () => {
          this.notificationService.error(this.translate
            .instant('common-errors.error-message'), 'X');
        }
      });
    this.dashboardService.getAvailabilityData()
      .subscribe({
        next: data => {
          this.pieTotalData = Object.values(data);
          this.pieChart.data.datasets[0].data = this.pieTotalData;
          this.pieChart.update();
        },
        error: () => {
          this.notificationService.error(this.translate
            .instant('common-errors.error-message'), 'X');
        }
      });
  }
  private setDateRange() {
    const today = new Date();
    this.lineChart.data.labels = [];
    this.lineChart.data.datasets[0].data = [];
    this.lineChart.data.datasets[1].data = [];
    if (this.selectedDataRange === DateRangeEnum.Week || this.selectedDataRange === DateRangeEnum.Month) {
      for (let i = 0; i < this.selectedDataRange; i++) {
        const formattedDate = this.datepipe.transform(today, 'dd.MM.yyyy');
        this.lineChart.data.labels.unshift(formattedDate);
        this.setLineChartData(formattedDate);
        today.setDate(today.getDate() - 1);
      }
    } else {
      today.setDate(1);
      this.getLineChartLabelData();
      for (let i = 0; i < this.selectedDataRange; i++) {
        const formattedDate = this.datepipe.transform(today, 'dd.M.yyyy');
        this.setLineChartData(formattedDate);
        today.setMonth(today.getMonth() - 1);
      }
    }
    this.lineChart.update();
  }
  private setLineChartData(date: string) {
    this.lineChart.data.datasets[0].data.unshift(
      this.comparisonData.booksRegistered[date] !== undefined
        ? this.comparisonData.booksRegistered[date]
        : 0
    );
    this.lineChart.data.datasets[1].data.unshift(
      this.comparisonData.usersRegistered[date] !== undefined
        ? this.comparisonData.usersRegistered[date]
        : 0
    );
  }
  // Chart Labels
  private getChartLabels() {
    this.translateSubscription = this.translate.get(
      [
        'components.admin.dashboard.line-chart.months',
        'components.admin.dashboard.line-chart.labels',
        'components.admin.dashboard.pie-chart.labels',
        'components.admin.dashboard.pie-chart.title'
      ]
    ).subscribe(value => {
      this.lineChartDataLabels = Object.values(value['components.admin.dashboard.line-chart.months']).map(x => x + '');
      this.lineChartLabels = Object.values(value['components.admin.dashboard.line-chart.labels']).map(x => x + '');
      this.pieChartLabels = Object.values(value['components.admin.dashboard.pie-chart.labels']).map(x => x + '');
      this.pieChartTitle = value['components.admin.dashboard.pie-chart.title'].toString();
      this.lineChart.data.datasets[0].label = this.lineChartLabels[0];
      this.lineChart.data.datasets[1].label = this.lineChartLabels[1];
      this.getLineChartLabelData();
      this.lineChart.update();
      this.pieChart.data.labels = this.pieChartLabels;
      this.pieChart.options.title.text = this.pieChartTitle;
      this.pieChart.update();
    });
  }

  // Chart Creation
  private createLineChart() {
    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        datasets: [{
          label: 'New Books Registered',
          data: [],
          backgroundColor: 'rgba(255, 255, 255, .2)',
          borderColor: 'rgba(242, 242, 242, .7)',
          borderWidth: 2,
        }, {
          label: 'New Users',
          data: [],
          backgroundColor: 'rgba(255, 153, 153, .2)',
          borderColor: 'rgba(191, 191, 191, .7)',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            gridLines: {
              color: 'rgba(166, 166, 166, 0.2)',
            },
            ticks: {
              fontColor: 'white',
            },
          }],
          yAxes: [{
            gridLines: {
              color: 'rgba(166, 166, 166, 0.2)',
            },
            ticks: {
              fontColor: 'white',
            },
          }]
        },
        legend: {
          labels: {
            fontColor: 'white',
          },
        }
      }
    });
    this.getLineChartLabelData();
  }
  private getLineChartLabelData() {
    this.lineChart.data.labels = [];
    const today = new Date();
    today.setDate(1);
    for (let i = 0; i < this.selectedDataRange; i++) {
      this.lineChart.data.labels.unshift(this.lineChartDataLabels[today.getMonth()]);
      today.setMonth(today.getMonth() - 1);
    }
  }
  private createBarChart() {
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['loading'],
        datasets: [{
          label: 'Registered Books',
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(40, 255, 20, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(40, 255, 20, 1)'
          ],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
  private createPieChart() {
    this.pieChart = new Chart('pieCanvas', {
      type: 'pie',
      data: {
        labels: ['Available', 'Requested', 'Reading', 'Deactivated'],
        datasets: [{
          label: 'Availability comparison',
          data: this.pieTotalData,
          backgroundColor: ['#4ce600',  '#FDB45C', '#46BFBD', '#F7464A'],
          hoverBackgroundColor: ['#4ce600',  '#FDB45C', '#46BFBD', '#F7464A'],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        title: {
          text: 'Total',
          display: true,
          position: 'top',
          fontStyle: 'bold'
        }
      }
    });
  }

  // barChart & PieChart combination
  barChartClicked(e: any) {
    const activeElement = this.barChart.getElementAtEvent(e);
    const element = activeElement[0];
    // tslint:disable:no-string-literal
    const label = this.barChart.data.labels[element['_index']];
    const data = this.pieChartCityData[label.toString()] as IAvailabilityData;
    this.pieChart.data.datasets[0].data = Object.values(data);
    this.pieChart.options.title.text = label + '';
    this.pieChart.update();
  }
  resetPie(): void {
    this.pieChart.data.datasets[0].data = this.pieTotalData;
    this.pieChart.options.title.text = this.pieChartTitle;
    this.pieChart.update();
  }

  ngOnDestroy() {
    this.translateSubscription.unsubscribe();
  }
}
