import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, SimpleChange} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {  
  @Output() onPageChange : EventEmitter<number> = new EventEmitter<number>()
  @Input() arraySize : number;
  @Input() pageSize : number;
  @Input() selectedPage : number;
  total : number;
  pageList : number[];
  constructor() { }

  ngOnInit(): void {    
    this.total = Math.ceil(this.arraySize / this.pageSize);
    this.changePageList();
  }  
  ngOnChanges(changes: SimpleChanges) {
    if(changes.arraySize){
      const currentItem: SimpleChange = changes.arraySize;
      this.total = currentItem.currentValue;
      this.ngOnInit();
    } 
  }
  selectPage(pageNumber : number){
    if(pageNumber == this.selectedPage){
      return;
    }
    this.onPageChange.emit(pageNumber);
    this.selectedPage = pageNumber;
    this.changePageList();
  }
  private changePageList(){
    let startPage = 1;
    let endPage = this.total;
    if(this.total <= 5){     

    }else if(this.selectedPage + 1 >= this.total){
      startPage = this.total - 4;
    }else{
      startPage = Math.max(this.selectedPage-2, 1);
      endPage = Math.max(this.selectedPage+2,Math.min(5,this.total));
    }
    this.pageList = [];
    for(startPage; startPage <= endPage; startPage++){
      this.pageList.push(startPage);
    }
  }
}

  
