import {Component, OnInit, ViewChild} from '@angular/core';
import {LanguageService} from '../../../core/services/language/language.service';
import {Language} from '../../../core/models/languages.enum';
import {AuthenticationMethod, AuthenticationService} from 'src/app/core/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';
import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('menu', {static: false}) menu: any;
  @ViewChild('notificationBell') notificationBell: NotificationBellComponent;
  @ViewChild('profileAvatar') profileAvatar: ProfileAvatarComponent;
  languages: Language[];
  isLoggedIn: boolean;
  canRegister: boolean;
  isOnHomePage: boolean;

  constructor(private authenticationService: AuthenticationService,
              public router: Router,
              public languageService: LanguageService)  {}

  ngOnInit() {
    this.isLoggedIn = this.authenticationService.isAuthenticated();
    this.canRegister = this.authenticationService.AuthMethod !== AuthenticationMethod.AzureActiveDirectory;
    this.languages = this.languageService.languages;
    this.authenticationService.getLoginEmitter().subscribe(() => {
      this.isLoggedIn = true;
    });
    this.authenticationService.getLogoutEmitter().subscribe(() => {
      this.isLoggedIn = false;
    });
    this.router.events.subscribe(() => this.isOnHomePage = this.router.url === '/');
  }

  redirectToLogin() {
    this.authenticationService.redirectToLogin();
  }

  openNotifications() {
    this.notificationBell.showOrHideNotificationBar();
  }

  openAvatarMenu() {
    this.profileAvatar.toggleOpen();
  }

}
