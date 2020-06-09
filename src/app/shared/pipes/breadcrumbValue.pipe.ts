import { Pipe, PipeTransform } from '@angular/core';
import { booksPage } from 'src/app/core/models/booksPage.enum';

@Pipe({ name: 'BreadcrumbValue' })
export class BreadcrumbValuePipe implements PipeTransform {
    transform(value: booksPage): string {
        switch (value) {
            case booksPage.list:
                return "Books";
            case booksPage.read:
                return "Read";
            case booksPage.registered:
                return "Registered";
            case booksPage.requested:
                return "Requested";
            case booksPage.currentOwned:
                return "Currently Owned";
        }
    }
}