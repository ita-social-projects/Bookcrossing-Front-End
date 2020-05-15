import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { IAuthor } from 'src/app/core/models/author';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorService } from 'src/app/core/services/author/authors.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {merge} from 'rxjs';

enum FormAction {
  Edit,
  Add,
  Merge
}


@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.scss']
})
export class AuthorFormComponent implements OnInit {

author: IAuthor;
authorsMerge: IAuthor[];

action: FormAction = FormAction.Add;

title: string;
form: FormGroup;

  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private authorService: AuthorService,
    private translate: TranslateService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authorService.formMergeAuthors?.length > 1) {
      this.authorsMerge = this.authorService.formMergeAuthors;
      this.author = this.authorsMerge[0];
      this.title = 'Merged Author';
      this.action = FormAction.Merge;
    } else if (this.authorService.formAuthor?.id) {
      this.author = this.authorService.formAuthor;
      this.title = 'Edit Author';
      this.action = FormAction.Edit;
    } else {
      const newAuthor: IAuthor = {
        firstName: '',
        lastName: '',
        middleName: ''
      };
      this.title = 'Add Author';
      this.action = FormAction.Add;
      this.author = newAuthor;
    }
    this.buildForm();
  }
  buildForm(): void {
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
        Validators.maxLength(30),
        Validators.pattern('&^|^([a-zA-Z \'-]+)$')]),
    });
  }


  submit(): void {
    this.author = {
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      middleName: this.form.get('middleName').value
    };
    if (this.action !== FormAction.Add) {
      this.author.id = this.form.get('id').value;
    }
    this.author.isConfirmed = true;
    switch (+this.action) {
      case FormAction.Edit:
        this.updateAuthor(this.author);
        break;
      case FormAction.Merge:
        this.mergeAuthors(this.author, this.authorsMerge.map(a => a.id));
        break;
      default:
        this.addAuthor(this.author);
        break;
    }
  }

  cancel(): void {
    this.location.back();
  }
  mergeAuthors(author: IAuthor, authorIds: number[]) {
    console.log(authorIds);
    this.authorService.mergeAuthors(author, authorIds).subscribe(
      () => {
        this.authorService.submitAuthor(author);
        this.cancel();
      },
      (error) => {
        this.notificationService.warn(this.translate
          .instant('Something went wrong!'), 'X');
      },
    );
  }
  addAuthor(author: IAuthor) {
    this.authorService.addAuthor(author).subscribe(
      (data: IAuthor) => {
        this.authorService.submitAuthor(author);
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
        this.authorService.submitAuthor(author);
        this.cancel();
      },
      (error) => {
        this.notificationService.warn(this.translate
          .instant('Something went wrong!'), 'X');
      },
    );
  }
}
