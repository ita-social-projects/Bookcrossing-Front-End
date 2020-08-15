import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from 'src/environments/environment';
import { INotification } from '../../models/notification';

@Injectable( {
  providedIn: 'root'
})

export class SignalRService {
  public data: INotification;
  public broadcastedData: INotification;

  private hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(environment.apiUrl + '/notifications', { accessTokenFactory: () => JSON.parse(localStorage.getItem("currentUser")).token.jwt})
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      this.data = data;
      console.log(data);
    });
  }

  public broadcastChartData = () => {
    this.hubConnection.invoke('broadcastdata', this.data)
    .catch(err => console.error(err));
  }

  public addBroadcastDataListener = () => {
    this.hubConnection.on('broadcastdata', (data) => {
      this.broadcastedData = data;
    })
  }
}
