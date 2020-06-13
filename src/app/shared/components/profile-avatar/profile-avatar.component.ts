import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-profile-avatar',
  templateUrl: './profile-avatar.component.html',
  styleUrls: ['./profile-avatar.component.scss']
})
export class ProfileAvatarComponent implements OnInit {

  userName: string = "unidentified";

  constructor(
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit() {
    let currentUser = this.authenticationService.currentUserValue;
    this.userName = currentUser.firstName + " " + currentUser.lastName;
  }

  isAdmin(): boolean {
    return this.authenticationService.isAdmin();
  }
  logout() {
    this.authenticationService.logout();
  }

}
