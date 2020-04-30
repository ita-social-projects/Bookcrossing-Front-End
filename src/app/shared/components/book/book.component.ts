import { UserService } from './../../../core/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RequestService } from 'src/app/core/services/request/request.service';
import { BookService } from 'src/app/core/services/book/book.service';
import { ActivatedRoute } from '@angular/router';
import { bookUrl } from 'src/app/configs/api-endpoint.constants';
import { IBook } from "src/app/core/models/book";
import { NotificationService } from "../../../core/services/notification/notification.service";
import {TranslateService} from "@ngx-translate/core";
import { IRequest } from 'src/app/core/models/request';
import { bookStatus } from 'src/app/core/models/bookStatus.enum';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { RequestQueryParams } from 'src/app/core/models/requestQueryParams';
import { IUser } from 'src/app/core/models/user';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [RequestService, BookService]
})
export class BookComponent implements OnInit {

    readonly baseUrl = bookUrl;
    book: IBook;
    bookId: number;
    userId: number;
    request: IRequest;
    requestId: number;
    bookStatus: bookStatus;
    status: string;
    currentOwner: IUser;
    userWhoRequested: IUser;
    firstOwner: IUser;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private bookService:BookService,
    private requestService:RequestService,
    private dialogService: DialogService,
    private userService: UserService
    ) {}
  
  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);

  this.bookService.getBookById(this.bookId).subscribe((value: IBook) => {
    this.book = value;
    this.status = this.getStatus(value);
    this.getCurrentOwner(this.book.userId);
    this.getFirstOwner();
    this.getUserWhoRequested();
  });
}
getCurrentOwner(userId: number){
  this.userService.getUserById(userId)
  .subscribe((value: IUser) => {
    this.currentOwner = value;
    });
}
getFirstOwner(){
  var requestQuery = new RequestQueryParams();
          requestQuery.last = false;
          requestQuery.first = true;
          this.requestService.getRequestForBook(this.bookId, requestQuery).subscribe((value: IRequest) => {
            this.firstOwner = value.owner;
            });
}

getUserWhoRequested(){
  var requestQuery = new RequestQueryParams();
          requestQuery.last = true;
          requestQuery.first = false;
          this.requestService.getRequestForBook(this.bookId, requestQuery).subscribe((value: IRequest) => {
            this.userWhoRequested = value.user;
            });
}
  getStatus(book: IBook): string{
    this.bookStatus = this.bookService.getStatus(book);
    if(this.bookStatus == bookStatus.available){
      return "Available";
    }
    else if(this.bookStatus == bookStatus.reading){
      return "Reeding";
    }
    else if(this.bookStatus == bookStatus.requested){
      return "Requested";
    }
  }

  async makeAvailable() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to share book? The book will be available for request!").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.book.available = true;
          this.bookService.putBook(this.bookId, this.book).subscribe(() => {
          }, err => {
            this.notificationService.warn(this.translate
              .instant("Something went wrong!"));
          });
        }
      });

  }
  async cancelRequest() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to cancel request? Current owner will be notified about your cancelation.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          var requestQuery = new RequestQueryParams();
          requestQuery.last = true;
          requestQuery.first = false;
          this.requestService.getRequestForBook(this.bookId, requestQuery).subscribe((value: IRequest) => {
            this.requestService.deleteRequest(value.id).subscribe((value: boolean) => {
              let canceled = value;
              if(canceled){
                this.notificationService.success(this.translate
                  .instant("Request is cancelled."));
              }
              }, err => {
                this.notificationService.warn(this.translate
                  .instant("Something went wrong!"));
              });
            });
        }
      });

  }
  async startReading() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to start reading? You will be shown as current owner.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          var requestQuery = new RequestQueryParams();
          requestQuery.last = true;
          requestQuery.first = false;
          this.requestService.getRequestForBook(this.bookId, requestQuery).subscribe((value: IRequest) => {
            this.requestService.approveReceive(value.id).subscribe((value: boolean) => {
              let received = value;
              if(received){
                this.notificationService.success(this.translate
                  .instant("Request is cancelled."));
              }
              }, err => {
                this.notificationService.warn(this.translate
                  .instant("Something went wrong!"));
              });
            });
        }
      });

  }

  async requestBook() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to request this book? Current owner will be notified about your request.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.requestService.requestBook(this.bookId).subscribe((value: IRequest) => {
            this.request = value;
            this.notificationService.success(this.translate
              .instant("Book is successfully requested. Please contact with current owner to receive a book"));
            }, err => {
              this.notificationService.warn(this.translate
                .instant("Something went wrong!"));
            });
        }
      });

  }

}
