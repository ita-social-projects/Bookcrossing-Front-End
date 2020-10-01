import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="mr-3">
      <mat-icon class="text-white">notifications</mat-icon>
      <span class="badge badge-danger">5</span>
    </button>

    <mat-menu #notificationMenu="matMenu">
      <mat-nav-list>
        <mat-list-item *ngFor="let message of messages">
          <a matLine href="">{{ message }}</a>
          <button mat-icon-button>
            <mat-icon class="text-danger">info</mat-icon>
          </button>
        </mat-list-item>
      </mat-nav-list>
    </mat-menu>
  `,
})
export class NotificationComponent {
  messages = ['CLR via C# is available now!', 'Your book CLR via C# was requested', 'Server Error Reports'];
}
