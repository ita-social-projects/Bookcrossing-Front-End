import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';


export interface IReport {
  id: number;
  reportedId: number;
  reportedBy: number;
  reason: string;
  date: string;
  resolvedBy: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  @Output() resolve: EventEmitter<number> = new EventEmitter<number>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Input() report: IReport[];

  reports: IReport[];
  constructor() { }
  resolved = true;
  ngOnInit(): void {
    this.reports = [{
        id: 1,
        reportedId: 123,
        reportedBy: 4125,
        reason: 'this feature is not implemented yet, this is static sample admin-table',
        date: '01.01.2077',
        resolvedBy: 1,
      }, {
        id: 2,
        reportedId: 1,
        reportedBy: 1,
        reason: 'Innapropriate name',
        date: '01.01.2020',
        resolvedBy: null,
      }, {
        id: 3,
        reportedId: 2,
        reportedBy: 2,
        reason: 'Innapropriate name',
        date: '02.01.2020',
        resolvedBy: 1
      }];
  }

  public Resolve(reportId: number): void {
    this.resolve.emit(reportId);
  }

  public Cancel(): void {
    this.cancel.emit();
  }
}
