import { Injectable } from '@angular/core';
import { INotification } from '../../models/notification';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';

@Injectable( {
  providedIn: 'root'
})

export class SignalRService {
  public hubConnection: signalR.HubConnection;

  public startConnection = (url: string) => {
    this.createHubConnection(url);

    this.hubConnection
      .start()
      .then(() => {})
      .catch(err => console.log('Error while starting connection: ' + err));

    this.hubConnection.serverTimeoutInMilliseconds = 100000;
    this.hubConnection.keepAliveIntervalInMilliseconds = 50000;
    this.hubConnection.onclose(() => { this.createHubConnection(url);  this.hubConnection.start() } );
  }

  private createHubConnection(url: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .configureLogging(signalR.LogLevel.None)
                            .withUrl(environment.apiUrl + url, 
                            { accessTokenFactory: () => JSON.parse(localStorage.getItem('currentUser')).token.jwt })
                            .build();
  }
}
