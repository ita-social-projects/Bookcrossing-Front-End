import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from "../../../core/services/language/language.service";
import {Language} from "../../../core/models/languages.enum";
import { BookParameters } from 'src/app/core/models/Pagination/bookParameters';
import { FilterParameters } from 'src/app/core/models/Pagination/FilterParameters';
import { PaginationService } from 'src/app/core/services/pagination/pagination.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('menu', {static: false}) menu: any;
  languages: Language[];
  isAuthorized : Boolean = false;  
  loginSubscription : any;

  constructor(  private authenticationService : AuthenticationService,
    private translate: TranslateService,
    public languageService: LanguageService) { }  
  
  ngOnInit() { 
    this.loginSubscription = this.authenticationService.userLoggedIn.subscribe(userLoggedin => {
      this.isAuthorized = userLoggedin;
    });
    this.languages = this.languageService.languages;
  }
  changeLang(lang: Language): void {
    this.languageService.setLanguage(lang);
    this.translate.use(this.languageService.langToString(lang));
  }
}
