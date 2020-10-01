import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  SimpleChange,
  // tslint:disable-next-line
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Output() PageChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() arraySize: number;
  @Input() pageSize: number;
  @Input() selectedPage: number;
  public total: number;
  public pageList: number[];
  constructor() {}

  public ngOnInit(): void {
    this.total = Math.ceil(this.arraySize / this.pageSize);
    this.changePageList();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.arraySize) {
      this.total = changes.arraySize.currentValue;
      this.ngOnInit();
    }
    if (changes.selectedPage) {
      this.selectedPage = changes.selectedPage.currentValue;
      this.changePageList();
    }
  }

  public selectPage(pageNumber: number): void {
    if (pageNumber === this.selectedPage) {
      return;
    }
    this.PageChange.emit(pageNumber);
  }

  private changePageList(): void {
    let startPage = 1;
    let endPage = this.total;
    if (this.total <= 5) {
    } else if (this.selectedPage + 1 >= this.total) {
      startPage = this.total - 4;
    } else {
      startPage = Math.max(this.selectedPage - 2, 1);
      endPage = Math.max(this.selectedPage + 2, Math.min(5, this.total));
    }
    this.pageList = [];
    for (startPage; startPage <= endPage; startPage++) {
      this.pageList.push(startPage);
    }
  }
}
