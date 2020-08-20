import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { notificationUrl } from '../../../configs/api-endpoint.constants';
import { NotificationBellService } from './notification-bell.service';
import { BookQueryParams } from '../../models/bookQueryParams';
import { IPage } from '../../models/page';
import { IBook } from '../../models/book';
import { INotification } from '../../models/notification';

// Testing of BookService
describe('#NotificationBellService getNotifications, deleteNotifications, makeNotificationsSeen', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let notificationBellService: NotificationBellService;

  beforeEach(() => {
    // Configures testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationBellService],
    });

    // Instantaites HttpClient, HttpTestingController and NotificationBellService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    notificationBellService = TestBed.inject(NotificationBellService);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no requests are outstanding.
  });

  // Test case 1
  it('should get Notifications array, GET method', () => {
    const notifications: INotification[] = [];

    notificationBellService
      .getNotifications()
      .subscribe(
        (data) =>
          expect(data).toEqual(notifications, 'should return notifications'),
        fail
      );

    // should have made one request to GET
    const req = httpTestingController.expectOne(notificationUrl);
    expect(req.request.method).toEqual('GET');
  });

  // Test case 2
  it('should send Notification id, DELETE method', () => {
    const id = 1;

    notificationBellService.deleteNotification(id).subscribe();

    // should have made one request to DELETE
    const req = httpTestingController.expectOne(
      notificationUrl + 'remove/' + id
    );
    expect(req.request.method).toEqual('DELETE');
  });

  // Test case 3
  it('should delete all notifications, DELETE method', () => {
    notificationBellService.deleteAllNotifications().subscribe();

    // should have made one request to DELETE
    const req = httpTestingController.expectOne(notificationUrl + 'remove/all');
    expect(req.request.method).toEqual('DELETE');
  });

  // Test case 4
  it('should send Notification id, PUT method', () => {
    const id = 1;

    notificationBellService.makeNotificationSeen(id).subscribe();

    // should have made one request to DELETE
    const req = httpTestingController.expectOne(notificationUrl + 'read/' + id);
    expect(req.request.method).toEqual('PUT');
  });

  // Test case 5
  it('should mark as read all notifications, PUT method', () => {
    notificationBellService.makeAllNotificationsSeen().subscribe();

    // should have made one request to DELETE
    const req = httpTestingController.expectOne(notificationUrl + 'read/all');
    expect(req.request.method).toEqual('PUT');
  });
});
