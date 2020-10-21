import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { booksPage } from 'src/app/core/models/booksPage.enum';

@Pipe({ name: 'BreadcrumbValue' })
export class BreadcrumbValuePipe implements PipeTransform {
  public constructor(
    protected translate: TranslateService
  ) {}

  public transform(value: booksPage): string {
    let isEn = this.translate.currentLang === 'en';
    switch (value) {
      case booksPage.List:
        if (isEn) {
          return 'Books';
        }
        return 'Книги';
      case booksPage.Read:
        if (isEn) {
          return 'Read';
        }
        return 'Прочитані';
      case booksPage.Registered:
        if (isEn) {
          return 'Registered';
        }
        return 'Зареєстровані';
      case booksPage.Requested:
        if (isEn) {
          return 'Requested';
        }
        return 'Запити';
      case booksPage.CurrentOwned:
        if (isEn) {
          return 'Currently Owned';
        }
        return 'Отримані';
      case booksPage.CurrentRead:
        if (isEn) {
          return 'Currently Reading';
        }
        return 'Зараз читаються';
      case booksPage.WishList:
        if (isEn) {
          return 'Wish List';
        }
        return 'Список бажань';
      }
    
  }
}
