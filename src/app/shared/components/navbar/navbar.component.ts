import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from "../../../core/services/language/language.service";
import {Language} from "../../../core/models/languages.enum";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('menu', {static: false}) menu: any;
  languages: Language[];
  constructor(  
    private translate: TranslateService,
    public languageService: LanguageService) { }  
  
  ngOnInit() {
    this.languages = this.languageService.languages;
  }

  changeLang(lang: Language): void {
    this.languageService.setLanguage(lang);
    this.translate.use(this.languageService.langToString(lang));
  }
}
