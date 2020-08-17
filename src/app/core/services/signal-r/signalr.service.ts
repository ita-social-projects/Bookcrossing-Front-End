import { Injectable } from '@angular/core';
import { INotification } from '../../models/notification';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';

@Injectable( {
  providedIn: 'root'
})

export class SignalRService {
  public hubConnection;

  public startConnection = (url: string) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(environment.apiUrl + url, 
                            { accessTokenFactory: () => JSON.parse(localStorage.getItem('currentUser')).token.jwt })
                            .build();
    this.hubConnection
      .start()
      .then(() => {})
      .catch(err => console.log('Error while starting connection: ' + err));
  }
}
