import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';
import {BaseChartDirective} from 'angular-bootstrap-md';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedLocation = 'All';
  pieChart: Chart;
  barChart: Chart;
  lineChart: Chart;
  languageChange: any;
  translateSubscription: any;
  pieChartLabels: string[];
  pieChartTitle: string;
  lineChartLabels: string[];
  lineChartDataLabels = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];

  totalBooksRegistered = 336;
  totalAmountOfUsers = 86;
  expiringRequests = 13;

  pieTotalData = [87, 137, 112];
  pieChartData = [
    {city: 'Lviv', data: [17, 42, 24]},
    {city: 'Dnipro', data: [11, 22, 13]},
    {city: 'Kyiv', data: [13, 34, 19]},
    {city: 'Chernivtsi', data: [5, 9, 11]},
    {city: 'Kharkiv', data: [9, 7, 10]},
    {city: 'Rivne', data: [15, 8, 12]},
    {city: 'Ivano-Frankivsk', data: [19, 23, 13]},
  ];
  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.createLineChart();
    this.createBarChart();
    this.createPieChart();
    this.getChartLabels();
    this.languageChange = this.translate.onLangChange.subscribe(() => this.getChartLabels());
  }
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

  private createLineChart() {
    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        datasets: [{
          label: 'New Books Registered',
          data: [19, 15, 27, 28, 25, 31, 42],
          backgroundColor: 'rgba(255, 255, 255, .2)',
          borderColor: 'rgba(242, 242, 242, .7)',
          borderWidth: 2,
        }, {
          label: 'New Users',
          data: [19, 12, 17, 25, 24, 28, 32],
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
  private getLineChartLabelData(start = 0, end = 6) {
    this.lineChart.data.labels = this.lineChartDataLabels.splice(start, end);
  }
  private createBarChart() {
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Lviv', 'Dnipro', 'Kyiv', 'Chernivtsi', 'Kharkiv', 'Rivne', 'Ivano-Frankivsk'],
        datasets: [{
          label: 'Registered Books',
          data: [83, 46, 66, 25, 26, 35, 55],
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
        }
      }
    });
  }
  private createPieChart() {
    this.pieChart = new Chart('pieCanvas', {
      type: 'pie',
      data: {
        labels: ['Requested', 'Available', 'Reading'],
        datasets: [{
          label: 'Availability comparison',
          data: this.pieTotalData,
          backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C'],
          hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870'],
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
  barChartClicked(e: any) {
    const activeElement = this.barChart.getElementAtEvent(e);
    const element = activeElement[0];
    // tslint:disable:no-string-literal
    const label = this.barChart.data.labels[element['_index']];
    const data = this.pieChartData.find(d => d.city === label).data;
    this.pieChart.data.datasets[0].data = data;
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
