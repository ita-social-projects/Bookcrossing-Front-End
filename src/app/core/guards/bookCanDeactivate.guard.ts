import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {CommentComponent} from '../../shared/components/comment/comment.component';
import {BookComponent} from '../../shared/components/book/book.component';

@Injectable()
export class BookCanDeactivateGuard implements CanDeactivate<BookComponent> {
  canDeactivate(component: BookComponent): boolean {
    if (!component.canLeave()) {
      return confirm('Warning: Do you want to discard all the changes?');
    }

    return true;
  }
}
