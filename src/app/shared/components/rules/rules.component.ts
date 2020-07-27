import { Component, OnInit } from '@angular/core';
import {LanguageService} from '../../../core/services/language/language.service';
import {Language} from '../../../core/models/languages.enum';
import {bookRegistrationUrl, booksUrl, registrationUrl} from '../../../configs/api-endpoint.constants';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  public Language = Language;
  public language: Language;

  public registrationUrl: string;
  public bookRegistrationUrl: string;
  public booksUrl: string;

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.language = this.languageService.getCurrentLang();
    this.languageService.languageUpdated.subscribe((language: Language) => {
      this.language = language;
    });

    this.registrationUrl = registrationUrl;
    this.bookRegistrationUrl = bookRegistrationUrl;
    this.booksUrl = booksUrl;
  }

}
