import { IBookPost } from './../../../core/models/bookPost';
import { UserService } from './../../../core/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { switchMap, first, take } from 'rxjs/operators';
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
import { pipe } from 'rxjs';
import { environment } from 'src/environments/environment';

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
    isRequester: boolean;
    requestId: number;
    bookStatus: bookStatus;
    currentOwner: IUser;
    userWhoRequested: IUser;
    firstOwner: IUser;
    imagePath: string;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private bookService:BookService,
    private requestService:RequestService,
    private dialogService: DialogService,
    private userService: UserService,
    private authentication: AuthenticationService
    ) {}
  
  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);

  this.bookService.getBookById(this.bookId).subscribe((value: IBook) => {
    this.book = value;
    this.getOwners(this.book.userId);
    this.getStatus(value);
    this.getUserWhoRequested();
    this.imagePath = environment.apiUrl +'/' + this.book.imagePath;
  });
}

isAuthenticated(){
  return this.authentication.isAuthenticated();
}

getOwners(userId: number){
  this.userService.getUserById(userId)
  .subscribe((value: IUser) => {
    this.currentOwner = value;
    let query = new RequestQueryParams();
    query.first = true;
    query.last = false;
          this.requestService.getRequestForBook(this.bookId, query).subscribe((value: IRequest) => {
            this.firstOwner = value.owner;
            }, err => {
              this.firstOwner = value;
            });
            if(this.firstOwner === undefined){
              this.firstOwner = value;
            }   
    });
}

getUserWhoRequested(){
  let query = new RequestQueryParams();
  query.first = false;
  query.last = true;
          this.requestService.getRequestForBook(this.bookId, query).subscribe((value: IRequest) => {
            if(this.bookStatus !== bookStatus.available)
              this.userWhoRequested = value.user;
                if(this.isAuthenticated()){
                  this.authentication.getUserId().subscribe((value : number) => {
                    if(value === this.userWhoRequested.id)
                    this.isRequester = true
                  },
                  err => {
                    this.isRequester = false
                  });
                }
            });
}
  getStatus(book : IBook){
    if(book.available){
      this.bookStatus = bookStatus.available
    }
    else{
      let query = new RequestQueryParams();
      query.first = false;
      query.last = true;    
      this.requestService.getRequestForBook(book.id, query)
     .subscribe((value: IRequest) => {
         if(value.receiveDate){
           this.bookStatus = bookStatus.reading
         }
         else{
           this.bookStatus = bookStatus.requested
         }
       }, error => {})
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
          console.log(this.book)
          let book: IBookPost = {
            id: this.book.id,
            name: this.book.name,
            userId: this.book.userId,
            publisher: this.book.publisher,
            available: true,
            notice: this.book.notice,
            authors: this.book.authors,
            genres: this.book.genres,
            image: null
          };
          this.bookService.putBook(this.bookId, book).subscribe(() => {
            this.notificationService.success(this.translate
              .instant("Your Book`s status changed to available."), "X");
          }, err => {
            this.notificationService.warn(this.translate
              .instant("Something went wrong!"), "X");
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
          let query = new RequestQueryParams();
          query.first = false;
          query.last = true;
          this.requestService.getRequestForBook(this.bookId, query).subscribe((value: IRequest) => {
            this.requestService.deleteRequest(value.id).subscribe((value: boolean) => {
              let canceled = value;
              if(canceled){
                this.notificationService.success(this.translate
                  .instant("Request is cancelled."), "X");
              }
              }, err => {
                this.notificationService.warn(this.translate
                  .instant("Something went wrong!"), "X");
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
          var query = new RequestQueryParams();
          query.last = true;
          this.requestService.getRequestForBook(this.bookId, query).subscribe((value: IRequest) => {
            this.requestService.approveReceive(value.id).subscribe((value: boolean) => {
                this.notificationService.success(this.translate
                  .instant("Book’s owner has been changed."), "X");
              }, err => {
                this.notificationService.warn(this.translate
                  .instant("Something went wrong!"), "X");
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
            this.notificationService.success(this.translate
              .instant("Book is successfully requested. Please contact with current owner to receive a book"), "X");
            }, err => {
              this.notificationService.warn(this.translate
                .instant("Something went wrong!"), "X");
            });
        }
      });

  }

}
