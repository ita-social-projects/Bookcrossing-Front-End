import { Component, OnInit } from '@angular/core';
import { Request } from 'src/app/core/models/request/request'
import {  ActivatedRoute } from "@angular/router";
import { HttpClient} from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { RequestService } from 'src/app/core/services/request/request.service'

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  
  bookId: number;
  requests: Request[];
  
  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private http: HttpClient,
  ) {}

  ngOnInit() {

  //   this.route.paramMap.pipe(
  //     switchMap(params => params.getAll('id'))
  // )
  // .subscribe(data=> this.bookId = +data);

    // this.requestService.getAllRequestesByBookId(this.bookId).subscribe((value: Request[]) => {
    //   this.requests = value;
    // });
  }

}
