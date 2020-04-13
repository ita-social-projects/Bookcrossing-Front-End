import {Component} from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import {LanguageService} from "./core/services/language/language.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  title = "BookCrossing Front End";
  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
  }

  ngOnInit(): void {
    const lang: string = this.languageService.setIfNotExists();
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }
}

