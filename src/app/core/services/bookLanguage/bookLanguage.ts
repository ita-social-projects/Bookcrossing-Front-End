import { languageUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILanguage } from '../../models/language';

@Injectable()
export class BookLanguageService {
  private apiUrl: string = languageUrl;

  constructor(private http: HttpClient) {}

  // get all
  getLanguage() {
    return this.http.get<ILanguage[]>(this.apiUrl);
  }

  getLanguageById(id: number) {
    return this.http.get<ILanguage>(this.apiUrl + id);
  }

  postLanguage(language: ILanguage) {
    return this.http.post<ILanguage>(this.apiUrl, language);
  }

  deleteLanguage(id: number) {
    return this.http.delete(this.apiUrl + id);
  }

  editLanguage(language: ILanguage) {
    return this.http.put(this.apiUrl, language);
  }
}
