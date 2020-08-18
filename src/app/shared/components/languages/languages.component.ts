import { Component, OnInit, ViewChild, } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../core/services/language/language.service';
import {Language} from '../../../core/models/languages.enum';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

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
