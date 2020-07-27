import { Pipe, PipeTransform } from '@angular/core';
import { booksPage } from 'src/app/core/models/booksPage.enum';

@Pipe({ name: 'BreadcrumbValue' })
export class BreadcrumbValuePipe implements PipeTransform {
    transform(value: booksPage): string {
        switch (value) {
            case booksPage.List:
                return "Books";
            case booksPage.Read:
                return "Read";
            case booksPage.Registered:
                return "Registered";
            case booksPage.Requested:
                return "Requested";
            case booksPage.CurrentOwned:
                return "Currently Owned";
            case booksPage.WishList:
                return "Wish List";
        }
    }
}