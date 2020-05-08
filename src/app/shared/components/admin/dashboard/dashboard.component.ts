import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public requestChartType = 'pie';
  public requestChartDatasets: Array<any> = [
    { data: [17, 42, 24], label: 'Status comparison' }
  ];
  public requestChartLabels: Array<any> = ['Requested', 'Available', 'Reading'];
  public requestChartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870'],
      borderWidth: 2,
    }
  ];
  public requestChartOptions: any = {
    responsive: true
  };

  public chartType = 'line';
  public chartDatasets: Array<any> = [
    { data: [65, 59, 80, 81, 56, 35, 45], label: 'Amount of Books Received' },
  ];
  public chartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];
  public receivedChartOptions: any = {
    responsive: true,
    steppedLine: true
  };
  constructor() { }

  ngOnInit(): void {
  }

}
