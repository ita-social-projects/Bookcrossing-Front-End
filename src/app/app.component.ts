import {Component, HostListener} from '@angular/core';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {Router} from '@angular/router';
import {AuthenticationService} from '../app/core/services/authentication/authentication.service';
import {Role} from './core/models/role.enum';
import {IUserInfo} from './core/models/userInfo';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from './core/services/language/language.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {

  currentUser: IUserInfo;
  title = 'BookCrossingFrontEnd';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit(): void {
    const lang: string = this.languageService.setIfNotExists();
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


}

