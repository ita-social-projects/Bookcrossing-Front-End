import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-profile-avatar',
  templateUrl: './profile-avatar.component.html',
  styleUrls: ['./profile-avatar.component.scss']
})
export class ProfileAvatarComponent implements OnInit {
  @ViewChild('mainElem') mainElem: ElementRef;
  userName = 'unidentified';

  constructor(
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit() {
    const currentUser = this.authenticationService.currentUserValue;
    this.userName = currentUser.firstName + ' ' + currentUser.lastName;
  }

  isAdmin(): boolean {
    return this.authenticationService.isAdmin();
  }
  logout() {
    this.authenticationService.logout();
  }

  toggleOpen() {
    this.mainElem.nativeElement.click();
  }

}
