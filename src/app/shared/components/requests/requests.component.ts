import { Component, OnInit } from '@angular/core';
import { IRequest } from 'src/app/core/models/request'
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from "@angular/router";
import { switchMap } from 'rxjs/operators';
import { NgxPaginationModule } from 'ngx-pagination';
import { RequestService } from 'src/app/core/services/request/request.service'

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  providers: [RequestService]
})
export class RequestsComponent implements OnInit {
  
  p: number = 1;
  bookId: number;
  requests: IRequest[];
  sortedData: IRequest[];
  
  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
  ) {}

  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);

    this.requestService.getAllRequestesByBookId(this.bookId).subscribe((value: IRequest[]) => {
      this.requests = value;
      this.sortedData = this.requests.slice();
    });
  }
  
  sortData(sort: Sort) {
    const data = this.requests.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return compare(a.id, b.id, isAsc);
        case 'book': return compare(a.book.name, a.book.name, isAsc);
        case 'user': return compare(a.user.firstName, a.user.firstName, isAsc);
        case 'date': return compare(a.requestDate.toDateString(), b.requestDate.toDateString(), isAsc);
        default: return 0;
      }
    });
  }
  approveRequest(requestId: number) {
    this.requestService.approveRequest(requestId).subscribe((value: IRequest) => {
      this.requests[requestId] = value;
    });;
  }

  deleteRequest(requestId: number) {
    this.requestService.deleteRequest(requestId).subscribe((value: IRequest) => {
      this.requests[requestId] = value;
    });;
  }

}
function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
