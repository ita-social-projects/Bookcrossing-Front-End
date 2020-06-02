import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { IAuthor } from 'src/app/core/models/author';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorService } from 'src/app/core/services/author/authors.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {merge} from 'rxjs';
import {min} from 'rxjs/operators';

enum FormAction {
  Edit = 'edit',
  Add = 'add',
  Merge = 'merge'
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
submitButtonText: string;
form: FormGroup;

  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private authorService: AuthorService,
    private translate: TranslateService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getRequestType();
    this.buildForm();
  }

  changeMergeAuthor(author: IAuthor) {
    this.author = author;
    this.buildForm();
  }

  private getSortedMergeAuthors(): IAuthor[] {
    const authors = this.authorService.formMergeAuthors.sort((c, n) => {
      if (c.id > n.id) {
        return 1;
      }
      if (c.id < n.id) {
        return -1;
      }
      return 0;
    });
    return authors;
  }
  private selectMergeAuthor(): IAuthor {
    const confirmedAuthors = this.authorsMerge.filter(a => a.isConfirmed === null || a.isConfirmed === true);
    if (confirmedAuthors?.length > 0) {
      return confirmedAuthors[0];
    }
    return this.authorsMerge[0];
  }

  getRequestType(): void {
    if (this.authorService.formMergeAuthors?.length > 1) {
      this.authorsMerge = this.getSortedMergeAuthors();
      this.author = this.selectMergeAuthor();
      this.action = FormAction.Merge;
    } else if (this.authorService.formAuthor?.id) {
      this.author = this.authorService.formAuthor;
      this.action = FormAction.Edit;
    } else {
      const newAuthor: IAuthor = {
        firstName: '',
        lastName: '',
      };
      this.action = FormAction.Add;
      this.author = newAuthor;
    }
    this.translateText();
  }
  private translateText() {
    this.title = 'components.admin.authors-form.' + this.action + '-title';
    this.submitButtonText = 'components.admin.authors-form.' + this.action + '-button';
  }
  buildForm(): void {
    this.form = new FormGroup({
      id : new FormControl({value: this.author.id, disabled: true}),
      firstName : new FormControl(this.author.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern('^([(a-zA-Z||а-щА-ЩЬьЮюЯяЇїІіЄєҐґыЫэЭ)\'-]+)$')]),
      lastName : new FormControl(this.author.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern('^([(a-zA-Z||а-щА-ЩЬьЮюЯяЇїІіЄєҐґыЫэЭ)\'-]+)$')])
    });
  }
  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.author = {
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value
    };
    if (this.action !== FormAction.Add) {
      this.author.id = this.form.get('id').value;
    }
    this.author.isConfirmed = true;
    switch (this.action) {
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
        this.notificationService.success(this.translate
          .instant('components.admin.authors.merge-success'), 'X');
      },
      (error) => {
        this.notificationService.error(this.translate
          .instant('common-errors.error-message'), 'X');
      },
    );
  }
  addAuthor(author: IAuthor) {
    this.authorService.addAuthor(author).subscribe(
      (data: IAuthor) => {
        this.authorService.submitAuthor(author);
        this.cancel();
        this.notificationService.success(this.translate
          .instant('components.admin.authors.add-success'), 'X');
      },
      (error) => {
        this.notificationService.error(this.translate
          .instant('common-errors.error-message'), 'X');
      },
    );
  }
  updateAuthor(author: IAuthor) {
    this.authorService.updateAuthor(author).subscribe(
      (data: IAuthor) => {
        this.authorService.submitAuthor(author);
        this.cancel();
        this.notificationService.success(this.translate
          .instant('components.admin.authors.update-success'), 'X');
      },
      (error) => {
        this.notificationService.error(this.translate
          .instant('common-errors.error-message'), 'X');
      },
    );
  }
}
