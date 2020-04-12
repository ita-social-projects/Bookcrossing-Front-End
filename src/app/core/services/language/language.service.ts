import {Injectable} from '@angular/core';
import {Language} from "src/app/core/models/languages.enum";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public defaultLang: Language = Language.en;

  public languages: Language[];

  constructor(
    private cookieService: CookieService
  ) {
    this.languages = Object.keys(Language)
      .filter((elem) => !Number.isInteger(parseInt(elem)))
      .map(val => Language[val]);
  }

  langToString(lang: Language): string {
    const stringLang:string = Language[lang];
    if(Number.isNaN(parseInt(stringLang))){
      return stringLang;
    }
    return Language[stringLang];
  }

  getCurrentLang(): Language{
    return Language[this.cookieService.get("lang")]
  }

  setLanguage(lang: Language): void{
    if(this.cookieService.check("lang")){
      this.cookieService.delete("lang");
    }
    const exp:Date = new Date(Date.now().valueOf() + 14400000); // 4 Hours
    this.cookieService.set("lang",this.langToString(lang),exp)
  }

  setIfNotExists(): string {
    let lang: Language = this.getCurrentLang();
    if (!lang) {
      lang = Language[navigator.language]
        || this.defaultLang;
      this.setLanguage(lang);
    }
    return this.langToString(lang);
  }
}
