import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http'
import {notificationUrl} from '../../../configs/api-endpoint.constants';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { INotification } from '../../models/notification';

@Injectable({
  providedIn: 'root'
})

export class NotificationBellService {
  public readonly baseUrl = notificationUrl;
  private notifications: INotification[];

  public constructor(private http: HttpClient) {
  }

  public getNotifications(): Observable<INotification[]> {
    return this.http.get<INotification[]>(this.baseUrl);
  }
  
  public deleteNotification(number: number) {
    return this.http.delete(this.baseUrl + 'remove/'+ number);
  }

  public deleteAllNotifications() {
    return this.http.delete(this.baseUrl + 'remove/all');
  }

  public makeNotificationSeen(id: number) {
    return this.http.put(this.baseUrl + 'read/' + id, id);
  }

  public makeAllNotificationsSeen() {
    return this.http.put(this.baseUrl + 'read/all', 0);
  }
}
