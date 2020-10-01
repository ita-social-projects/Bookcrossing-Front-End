import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import * as _ from 'lodash';
import { SortParameters } from 'src/app/core/models/Pagination/sortParameters';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss'],
})
export class AdminTableComponent implements OnInit {
  @Output() selectedRowsChange: EventEmitter<number[]> = new EventEmitter<
    number[]
  >();
  @Output() selectedHeaderChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() viewClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() editClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() booleanButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClicked: EventEmitter<any> = new EventEmitter<any>();

  @Input() data: any[];
  @Input() dataProperties: string[];
  @Input() displayColumns: string[];
  @Input() canDelete = false;
  @Input() canEdit = false;
  @Input() canView = false;

  @Input() sortParams: SortParameters;
  @Input() selectedRows: number[];

  @Input() booleanButtonText: string;

  constructor() {}

  public ngOnInit(): void {}

  public onSelectedRowChange(selectedItem: any): void {
    if (this.selectedRows) {
      this.selectedRows = _.xorBy(
        this.selectedRows,
        [selectedItem],
        this.dataProperties[0]
      );
      this.selectedRowsChange.emit(this.selectedRows);
    }
  }

  public onView(item: any, $event): void {
    $event.stopPropagation();
    this.viewClicked.emit(item);
  }

  public onEdit(item: any, $event): void {
    $event.stopPropagation();
    this.editClicked.emit(item);
  }

  public onDelete(item: any, $event): void {
    $event.stopPropagation();
    this.deleteClicked.emit(item);
  }

  public onHeaderClicked($event: Sort): void {
    this.sortParams.orderByField = $event.active;
    this.sortParams.orderByAscending = $event.direction === 'asc';
    this.selectedHeaderChange.emit();
  }

  public onBooleanButtonClick(item: any, $event): void {
    $event.stopPropagation();
    this.booleanButtonClicked.emit(item);
  }

  public isNotBoolean(value: any): boolean {
    return !(typeof value === 'boolean');
  }

  public isBooleanHeader(index: number): string {
    if (
      this.data &&
      this.data[0] &&
      typeof this.data[0][this.dataProperties[index]] === 'boolean'
    ) {
      return 'text-center';
    }
  }
}
