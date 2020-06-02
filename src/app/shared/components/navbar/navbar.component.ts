import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../core/services/language/language.service';
import {Language} from '../../../core/models/languages.enum';
import {AuthenticationService} from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('menu', {static: false}) menu: any;
  languages: Language[];
  isLoggedIn: boolean;

  constructor(private authenticationService: AuthenticationService,
              private translate: TranslateService,
              public languageService: LanguageService)  { }

  ngOnInit() {
    this.isLoggedIn = this.authenticationService.isAuthenticated();
    this.languages = this.languageService.languages;
    this.authenticationService.getLoginEmitter().subscribe(() => {
      this.isLoggedIn = true;
    });
    this.authenticationService.getLogoutEmitter().subscribe(() => {
      this.isLoggedIn = false;
    });
  }
}
