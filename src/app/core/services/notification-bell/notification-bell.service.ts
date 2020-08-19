import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import {notificationUrl} from '../../../configs/api-endpoint.constants';
import { Observable } from 'rxjs';
import { INotification } from '../../models/notification';

@Injectable({
  providedIn: 'root'
})

export class NotificationBellService {
  public readonly baseUrl = notificationUrl;

  public constructor(private http: HttpClient) {
  }

  public getNotifications(): Observable<INotification[]> {
    return this.http.get<INotification[]>(this.baseUrl);
  }

  public deleteNotification(id: number): Observable<object> {
    return this.http.delete(this.baseUrl + 'remove/' + id);
  }

  public deleteAllNotifications(): Observable<object> {
    return this.http.delete(this.baseUrl + 'remove/all');
  }

  public makeNotificationSeen(id: number): Observable<object> {
    return this.http.put(this.baseUrl + 'read/' + id, id);
  }

  public makeAllNotificationsSeen(): Observable<object> {
    return this.http.put(this.baseUrl + 'read/all', 0);
  }
}
