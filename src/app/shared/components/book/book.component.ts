import { UserService } from './../../../core/services/user/user.service';
import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { switchMap, first, take } from 'rxjs/operators';
import { RequestService } from 'src/app/core/services/request/request.service';
import { BookService } from 'src/app/core/services/book/book.service';
import { ActivatedRoute } from '@angular/router';
import { bookUrl } from 'src/app/configs/api-endpoint.constants';
import { IBook } from 'src/app/core/models/book';
import { NotificationService } from '../../../core/services/notification/notification.service';
import {TranslateService} from '@ngx-translate/core';
import { IRequest } from 'src/app/core/models/request';
import { bookStatus } from 'src/app/core/models/bookStatus.enum';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { RequestQueryParams } from 'src/app/core/models/requestQueryParams';
import { IUser } from 'src/app/core/models/user';
import { environment } from 'src/environments/environment';
import { BookEditFormComponent } from '../book-edit-form/book-edit-form.component';
import { RefDirective } from '../../directives/ref.derictive';
import { IBookPut } from 'src/app/core/models/bookPut';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [RequestService, BookService]
})
export class BookComponent implements OnInit {
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

    readonly baseUrl = bookUrl;
    book: IBook;
    bookId: number;
    isRequester: boolean;
    isBookOwner: boolean;
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
    private bookService: BookService,
    private requestService: RequestService,
    private dialogService: DialogService,
    private userService: UserService,
    private authentication: AuthenticationService,
    private resolver: ComponentFactoryResolver
    ) {}

  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data => this.bookId = +data);

    this.bookService.getBookById(this.bookId).subscribe((value: IBook) => {
    this.book = value;
    this.getOwners(this.book.userId);
    this.bookService.getStatus(this.book).then(res => this.bookStatus = res);
    if(!value.available){
      this.getUserWhoRequested();
    }
    this.imagePath = environment.apiUrl + '/' + this.book.imagePath;
  });
}

isAuthenticated() {
  return this.authentication.isAuthenticated();
}

isAdmin() {
  return this.authentication.isAdmin();
}

getOwners(userId: number) {
  this.userService.getUserById(userId)
  .subscribe((value: IUser) => {
    this.currentOwner = value;
    if (this.isAuthenticated()) {
      this.authentication.getUserId().subscribe((value: number) => {
          if (value === this.currentOwner.id) {
            this.isBookOwner = true;
          }
        },
        err => {
          this.isBookOwner = false;
        });
    }
    if(!this.book.available){
      const query = new RequestQueryParams();
      query.first = true;
      query.last = false;
      this.requestService.getRequestForBook(this.bookId, query).subscribe((value: IRequest) => {
        this.firstOwner = value.owner;
      }, err => {
        this.firstOwner = value;
      });
    }
    else{
      this.firstOwner = value;
    }
    if (this.firstOwner === undefined) {
              this.firstOwner = value;
            }
    });
}
showEditForm(book: IBook) {
  const formFactory = this.resolver.resolveComponentFactory(BookEditFormComponent);
  const instance = this.refDir.containerRef.createComponent(formFactory).instance;
  instance.book = book;
  instance.onCancel.subscribe(() => {this.refDir.containerRef.clear(); this.ngOnInit(); });
}

getUserWhoRequested() {
  const query = new RequestQueryParams();
  query.first = false;
  query.last = true;
  this.requestService.getRequestForBook(this.bookId, query).subscribe((value: IRequest) => {
            if (this.bookStatus !== bookStatus.available) {
              this.userWhoRequested = value.user;
            if (this.isAuthenticated()) {
                  this.authentication.getUserId().subscribe((value: number) => {
                    if (value === this.userWhoRequested.id) {
                    this.isRequester = true;
                    }
                  },
                  err => {
                    this.isRequester = false;
                  });
                }
            }
            });
}
getFormData(book: IBookPut): FormData {
  const formData = new FormData();
  Object.keys(book).forEach((key, index) => {
    if (book[key]) {
      if (Array.isArray(book[key])) {
        book[key].forEach((i, index) => {
          if (key == 'fieldMasks') {
            formData.append(`${key}[${index}]`, book[key][index]);
          } else {
          formData.append(`${key}[${index}][id]`, book[key][index].id);
          }
        });
      } else {
        formData.append(key, book[key]);
      }
    }
  });
  return formData;
}
  async makeAvailable() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('Do you want to share book? The book will be available for request!').toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          const book: IBookPut = {
            id: this.book.id,
            fieldMasks: ['Available'],
            available: true,
          };
          const formData = this.getFormData(book);
          this.bookService.putBook(this.bookId, formData).subscribe(() => {
            this.ngOnInit();
            this.notificationService.success(this.translate
              .instant('Your Book`s status changed to available.'), 'X');
          }, err => {
            this.notificationService.error(this.translate
              .instant('Something went wrong!'), 'X');
          });
        }
      });

  }
  async cancelRequest() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('Do you want to cancel request? Current owner will be notified about your cancelation.').toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          const query = new RequestQueryParams();
          query.first = false;
          query.last = true;
          this.requestService.getRequestForBook(this.bookId, query).subscribe((value: IRequest) => {
            this.requestService.deleteRequest(value.id).subscribe(() => {
                this.ngOnInit();
                this.notificationService.success(this.translate
                  .instant('Request is cancelled.'), 'X');
              }, err => {
                this.notificationService.error(this.translate
                  .instant('Something went wrong!'), 'X');
              });
            });
        }
      });

  }
  async startReading() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('Do you want to start reading? You will be shown as current owner.').toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          const query = new RequestQueryParams();
          query.last = true;
          this.requestService.getRequestForBook(this.bookId, query).subscribe((value: IRequest) => {
            this.requestService.approveReceive(value.id).subscribe(() => {
              this.ngOnInit();
              this.notificationService.success(this.translate
                  .instant('Book’s owner has been changed.'), 'X');
              this.Donate()
              }, err => {
                this.notificationService.error(this.translate
                  .instant('Something went wrong!'), 'X');
              });
            });
        }
      });

  }

  async Donate(){
    this.dialogService
      .openDonateDialog(
        await this.translate.get('\You can donate some money for the project. It\'s optional.').toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          window.open("https://openeyes.org.ua/")
        }
      });
  }

  async requestBook() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('Do you want to request this book? Current owner will be notified about your request.').toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.requestService.requestBook(this.bookId).subscribe((value: IRequest) => {
            this.ngOnInit();
            this.notificationService.success(this.translate
              .instant('Book is successfully requested. Please contact with current owner to receive a book'), 'X');
            }, err => {
              this.notificationService.error(this.translate
                .instant('Something went wrong!'), 'X');
            });
        }
      });

  }

}
