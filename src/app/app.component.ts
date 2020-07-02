import {Component, HostListener} from '@angular/core';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {Router} from '@angular/router';
import {AuthenticationService} from '../app/core/services/authentication/authentication.service';
import {Role} from './core/models/role.enum';
import {IUser} from '../app/core/models/user';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from './core/services/language/language.service';

import {MatDialog} from '@angular/material/dialog';
import {LocationPopupComponent} from './shared/components/location-popup/location-popup.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {

  currentUser: IUser;
  title = 'BookCrossingFrontEnd';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialogService: MatDialog
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit(): void {
    const lang: string = this.languageService.setIfNotExists();
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.dialogService.open(LocationPopupComponent);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


}

