import { CommonModule } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { booksPage } from 'src/app/core/models/booksPage.enum';

@Pipe({ name: 'BreadcrumbValue' })
export class BreadcrumbValuePipe implements PipeTransform {
  public transform(value: booksPage): string {
      return '';
  }
}
