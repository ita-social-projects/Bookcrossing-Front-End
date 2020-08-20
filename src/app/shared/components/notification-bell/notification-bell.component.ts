import { Component, OnInit, HostListener } from '@angular/core';
import { Router} from '@angular/router';
import { NotifyAction } from 'src/app/core/models/notifyAction.enum';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { bookState } from 'src/app/core/models/bookState.enum';
import { INotification } from 'src/app/core/models/notification';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { NotificationBellService } from 'src/app/core/services/notification-bell/notification-bell.service';
import { RequestService } from 'src/app/core/services/request/request.service';
import {DialogService} from 'src/app/core/services/dialog/dialog.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { IRequest } from 'src/app/core/models/request';
import { BookService } from 'src/app/core/services/book/book.service';
import { IBook } from 'src/app/core/models/book';
import { SignalRService } from 'src/app/core/services/signal-r/signalr.service';
import { RequestQueryParams } from 'src/app/core/models/requestQueryParams';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss'],
})
export class NotificationBellComponent implements OnInit {
  public numberOfNotifications: number;
  public notifications: INotification[];
  private isOpened: boolean;
  private signalRHubUrl = '/notifications/hub';

  public constructor(
    public signalRService: SignalRService,
    private router: Router,
    private bookService: BookService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private requestService: RequestService,
    private notificationBellService: NotificationBellService,
    private authenticationService: AuthenticationService
  ) {}

  public ngOnInit(): void {
    this.getNotifications();
    this.signalRService.startConnection(this.signalRHubUrl);
    this.getNewNotifications();
  }

  private getNotifications(): void {
    this.notificationBellService
      .getNotifications()
      .subscribe((notifications) => {
        this.notifications = notifications;
        this.getNotificationsCount(notifications);
      });
  }

  public showOrHideNotificationBar(): void {
    if (document.getElementById('box').style.height === '60vh') {
      document.getElementById('box').style.height = '0vh';
      this.makeAllSeen();
      this.isOpened = false;
    } else {
      document.getElementById('box').style.height = '60vh';
      this.isOpened = true;
    }
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event): void {
    if (this.isOpened) {
      document.getElementById('box').style.height = '0vh';
      this.makeAllSeen();
      this.isOpened = false;
    }
  }

  private getNotificationsCount(notifications: INotification[]): void {
    this.numberOfNotifications = 0;
    notifications.forEach((notification) => {
      if (!notification.isSeen) {
        this.numberOfNotifications++;
      }
    });
  }

  public makeNotificationSeen(id: number): void {
    this.notificationBellService
      .makeNotificationSeen(id)
      .subscribe((res) => this.getNotifications());
  }

  public async deleteAll(): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translateService
          .get('Do you really want to delete all notifications?')
          .toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.notificationBellService
            .deleteAllNotifications()
            .subscribe(() => this.getNotifications());
        }
      });
  }

  public makeAllSeen(): void {
    this.notificationBellService
      .makeAllNotificationsSeen()
      .subscribe(() => this.getNotifications());
  }

  public deleteNotification(id: number): void {
    this.notificationBellService
      .deleteNotification(id)
      .subscribe(() => this.getNotifications());
  }

  public formatDate(date: Date): string {
    TimeAgo.addLocale(en);
    const d = new Date(date);
    d.setHours(d.getHours() + 3);
    const timeAgo = new TimeAgo('en-US');
    return timeAgo.format(d);
  }

  public navigateToBook(bookId: number): void {
    this.router.navigate(['/book/' + bookId]);
    document.getElementById('box').style.height = '0vh';
  }

  public checkIfBookIsAvailable(bookId: number): boolean {
    let res;
    this.bookService.getBookById(bookId).subscribe((book: IBook) => {
      res = book.state === bookState.available;
    });
    return res;
  }

  public async requestBook(bookId: number): Promise<void> {
    const userHasValidLocation: boolean = await this.authenticationService.validateLocation();
    if (!userHasValidLocation) {
      return;
    }
    if (!this.checkIfBookIsAvailable(bookId)) {
      this.notificationService.error(
        this.translateService.instant('Book is unavailable for request!'),
        'X'
      );
      return;
    }
    this.dialogService
      .openConfirmDialog(
        await this.translateService
          .get(
            'Do you want to request this book? Current owner will be notified about your request.'
          )
          .toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.requestService.requestBook(bookId).subscribe(
            (value: IRequest) => {
              this.notificationService.success(
                this.translateService.instant(
                  'Book is successfully requested. Please contact with current owner to receive a book'
                ),
                'X'
              );
            },
            (err) => {
              this.notificationService.error(
                this.translateService.instant('Something went wrong!'),
                'X'
              );
            }
          );
        }
      });
  }

  public async startReadingBook(bookId: number): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translateService
          .get(
            'Do you want to start reading? You will be shown as current owner.'
          )
          .toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          const query = new RequestQueryParams();
          query.last = true;
          this.requestService
            .getRequestForBook(bookId, query)
            .subscribe((value: IRequest) => {
              this.bookService.getBookById(bookId).subscribe((book: IBook) => {
                if (
                  book.state !== bookState.available &&
                  book.state !== bookState.inActive &&
                  book.state !== bookState.reading &&
                  this.isRequester(bookId)
                ) {
                  this.requestService.approveReceive(value.id).subscribe(
                    () => {
                      this.notificationService.success(
                        this.translateService.instant(
                          'Book’s owner has been changed.'
                        ),
                        'X'
                      );
                    },
                    () => {
                      this.notificationService.error(
                        this.translateService.instant(
                          'You cannot start reading this book!'
                        ),
                        'X'
                      );
                    }
                  );
                } else {
                  this.notificationService.error(
                    this.translateService.instant(
                      'You cannot start reading this book!'
                    ),
                    'X'
                  );
                }
              });
            });
        }
      });
  }

  public isRequester(bookId: number): boolean {
    const query = new RequestQueryParams();
    query.first = false;
    query.last = true;
    let res = false;
    this.requestService
      .getRequestForBook(bookId, query)
      .subscribe((request: IRequest) => {
        const userWhoRequested = request.user;
        this.authenticationService.getUserId().subscribe((id: number) => {
          if (id === userWhoRequested.id) {
            res = true;
          }
        });
      });

    return res;
  }

  public checkIfOpen(action: NotifyAction): boolean {
    return action.valueOf() === 1;
  }

  public checkIfRequest(action: NotifyAction): boolean {
    return action.valueOf() === 2;
  }

  public checkIfStartReading(action: NotifyAction): boolean {
    return action.valueOf() === 3;
  }

  public getNewNotifications(): void {
    this.signalRService.hubConnection.on(
      'Notify',
      (notification: INotification) => {
        this.notifications.unshift(notification);
        this.numberOfNotifications++;
      }
    );
  }
}
