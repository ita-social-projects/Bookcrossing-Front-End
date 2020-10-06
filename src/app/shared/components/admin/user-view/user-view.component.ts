import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { IBook } from 'src/app/core/models/book';
import { IBookPut } from 'src/app/core/models/bookPut';
import { BookQueryParams } from 'src/app/core/models/bookQueryParams';
import { IUserInfo } from 'src/app/core/models/userInfo';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { BookService } from 'src/app/core/services/book/book.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { IRootDeleteComment } from '../../../../core/models/comments/root-comment/rootDelete';
import { DialogService } from '../../../../core/services/dialog/dialog.service';

@Component({
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {
  public user: IUserInfo;
  public books: IBook[];
  public activeBooksExist: boolean;
  public currentUserId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private usersService: UserService,
    private booksService: BookService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private dialogService: DialogService
  ) {
    this.currentUserId = authService.currentUserValue.id;
  }

  public ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(switchMap((params) => params.getAll('id')))
      .subscribe((id) => {
        this.loadUser(+id);
      });
  }

  private loadUser(id: number): void {
    this.usersService.getUserById(id).subscribe((user) => {
      this.user = user;
      this.loadUsersBooks();
    });
  }

  private loadUsersBooks(): void {
    if (!this.user) {
      return;
    }

    this.booksService.getCurrentBooksOfUser(this.user.id).subscribe((books) => {
      this.books = books;
      this.activeBooksExist = this.books.some((book) => book.state !== 3);
    });
  }

  public async onDeleteUserButtonClick(): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('components.admin.user-view.confirmation.delete',
          { firstName: this.user.firstName, lastName: this.user.lastName }).toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.usersService.deleteUser(this.user.id).subscribe(
            (data) => this.loadUser(this.user.id),
            (error) =>
              this.notificationService.error(
                this.translate.instant('common-errors.error-message'),
                'X'
              )
          );
        }
      });
  }

  public async onRecoverUserButtonClick() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get('components.admin.user-view.confirmation.recover',
          { firstName: this.user.firstName, lastName: this.user.lastName }).toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          this.usersService.recoverUser(this.user.id).subscribe(
            (data) => this.loadUser(this.user.id),
            (error) =>
              this.notificationService.error(
                this.translate.instant('common-errors.error-message'),
                'X'
              )
          );
        }
      });
  }

  public getFormData(book: IBookPut): FormData {
    const formData = new FormData();
    Object.keys(book).forEach((key, i) => {
      if (book[key]) {
        if (Array.isArray(book[key])) {
          book[key].forEach((_, index) => {
            if (key === 'fieldMasks') {
              formData.append(`${key}[${index}]`, book[key][index]);
            } else {
              formData.append(`${key}[${index}][id]`, book[key][index].id);
            }
          });
        } else {
          formData.append(key, book[key]);
        }
      }
    });
    return formData;
  }

  public async onTakeOwnershipButtonClick(bookId: number): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get(this.translate.instant('components.admin.user-view.confirmation.take-ownership')).toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {
          const bookPut: IBookPut = {
            id: bookId,
            userId: this.authService.currentUserValue.id,
            fieldMasks: ['UserId'],
          };
          this.booksService.putBook(bookId, this.getFormData(bookPut)).subscribe(
            (data) => this.loadUsersBooks(),
            (error) =>
              this.notificationService.error(
                this.translate.instant('common-errors.error-message'),
                'X'
              )
          );
        }
      });
  }

  public async onActivateButtonClick(bookId: number): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get(this.translate.instant('components.admin.user-view.confirmation.activate')).toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {

          this.booksService.activateBook(bookId).subscribe(
            (data) => this.loadUsersBooks(),
            (error) =>
              this.notificationService.error(
                this.translate.instant('common-errors.error-message'),
                'X'
              )
          );
        }
      });
  }

  public async onDeactivateBookButtonClick(bookId: number): Promise<void> {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get(this.translate.instant('components.admin.user-view.confirmation.deactivate')).toPromise()
      )
      .afterClosed()
      .subscribe(async (res) => {
        if (res) {

          this.booksService.deactivateBook(bookId).subscribe(
            (data) => this.loadUsersBooks(),
            (error) =>
              this.notificationService.error(
                this.translate.instant('common-errors.error-message'),
                'X'
              )
          );
        }
      });
  }
}
