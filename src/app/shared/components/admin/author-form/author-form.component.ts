import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { IAuthor } from 'src/app/core/models/author';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorService } from 'src/app/core/services/author/authors.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.scss']
})
export class AuthorFormComponent implements OnInit {

@Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
@Input() author: IAuthor;

isEdited = false;
form: FormGroup;
title = 'Add Author';

  constructor(
    private authorService: AuthorService,
    private translate: TranslateService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      id : new FormControl({value: this.author.id, disabled: true}),
      firstName : new FormControl(this.author.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern('^([a-zA-Z \'-]+)$')]),
      lastName : new FormControl(this.author.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern('^([a-zA-Z \'-]+)$')]),
      middleName : new FormControl(this.author.middleName, [
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern('^([a-zA-Z \'-]+)$')]),
    });
  }

  submit(): void {
    const newAuthor: IAuthor = {
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      middleName: this.form.get('middleName').value
    };
    if (this.isEdited) {
      newAuthor.id = this.form.get('id').value;
      this.updateAuthor(newAuthor);
      console.log(newAuthor);
    } else {
      this.addAuthor(newAuthor);
    }
  }

  cancel(): void {
    this.onCancel.emit();
    this.form.reset();
  }
  addAuthor(author: IAuthor) {
    this.authorService.addAuthor(author).subscribe(
      (data: IAuthor) => {
        this.authorService.editAuthor(author);
        this.cancel();
      },
      (error) => {
        this.notificationService.warn(this.translate
          .instant('Something went wrong!'), 'X');
      },
    );
  }
  updateAuthor(author: IAuthor) {
    this.authorService.updateAuthor(author).subscribe(
      (data: IAuthor) => {
        this.authorService.editAuthor(author);
        this.cancel();
      },
      (error) => {
        this.notificationService.warn(this.translate
          .instant('Something went wrong!'), 'X');
      },
    );
  }
}
