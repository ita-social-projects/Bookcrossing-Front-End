import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { ILanguage } from '../../models/language';
import { languageUrl } from '../../../configs/api-endpoint.constants';
import { CompletePaginationParams } from '../../models/Pagination/completePaginationParameters';
import { IPage } from '../../models/page';
import { PaginationService } from '../pagination/pagination.service';

@Injectable({
  providedIn: 'root'
})
export class BookLanguageService {
  public formLanguage: ILanguage;
  private languageSubmittedSource = new Subject<ILanguage>();
  languageSubmitted = this.languageSubmittedSource.asObservable();
  constructor(
    private http: HttpClient,
    private pagination: PaginationService
  ) { }

  submitLanguage(language: ILanguage) {
    this.languageSubmittedSource.next(language);
  }

  getLanguage(): Observable<ILanguage[]> {
    return this.http.get<ILanguage[]>(languageUrl);
  }

  getLanguagePage(paginationParameters: CompletePaginationParams): Observable<IPage<ILanguage>> {
    return this.pagination.getPaginatedPage<ILanguage>(languageUrl + 'paginated', paginationParameters);
  }

  getLanguageById(languageId: number) {
    return this.http.get<ILanguage[]>( languageUrl + `/${languageId}`);
  }

  addLanguage(language: ILanguage) {
    return this.http.post<ILanguage>(languageUrl, language);
  }

  deleteLanguage(languageId: number) {
    return this.http.delete<ILanguage>(languageUrl + `${languageId}`);
  }

  updateLanguage(language: ILanguage) {
    return this.http.put<ILanguage>(languageUrl, language);
  }
}
