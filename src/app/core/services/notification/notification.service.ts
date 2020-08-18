import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) { }

  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };



  success(msg, action) {
    this.config.panelClass = ['notification', 'success'];
    this.snackBar.open(msg, action, this.config);
  }

  error(msg, action) {
    this.config.panelClass = ['notification', 'error'];
    this.snackBar.open(msg, action, this.config);
  }

  info(msg, action) {
    this.config.panelClass = ['notification', 'info'];
    this.snackBar.open(msg, action, this.config);
  }
  warn(msg, action) {
    this.config.panelClass = ['notification', 'warn'];
    this.snackBar.open(msg, action, this.config);
  }
}
