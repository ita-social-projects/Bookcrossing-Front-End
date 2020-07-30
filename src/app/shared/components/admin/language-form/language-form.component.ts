import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { ILanguage } from '../../../../core/models/language';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookLanguageService } from '../../../../core/services/bookLanguage/bookLanguage.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

enum FormAction {
  Edit = 'edit',
  Add = 'add'
}

@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss']
})
export class LanguageFormComponent implements OnInit {

  language: ILanguage;
  action: FormAction = FormAction.Add;
  title: string;
  submitButtonText: string;
  form: FormGroup;
  hideErrorInterval: NodeJS.Timeout;
  submitted: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private languageService: BookLanguageService,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getRequestType();
    this.buildForm();
  }

  getRequestType(): void {
    if (this.languageService.formLanguage?.id) {
      this.language = this.languageService.formLanguage;
      this.action = FormAction.Edit;
    } else {
      const newLanguage: ILanguage = {
        name: ''
      };
      this.action = FormAction.Add;
      this.language = newLanguage;
    }
    this.translateText();
  }

  private translateText() {
    this.title = 'components.admin.languages-form.' + this.action + '-title';
    this.submitButtonText = 'components.admin.languages-form.' + this.action + '-button';
  }

  buildForm(): void {
    this.form = new FormGroup({
      id : new FormControl({value: this.language.id, disabled: true}),
      name : new FormControl(this.language.name, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern('^([(a-zA-Z||а-щА-ЩЬьЮюЯяЇїІіЄєҐґыЫэЭ)\'-]+)$')])
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitted) {
      return;
    }
    this.submitted = true;
    this.language = {
      name: this.form.get('name').value,
    };
    if (this.action !== FormAction.Add) {
      this.language.id = this.form.get('id').value;
    }
    switch (this.action) {
      case FormAction.Edit:
        this.updateLanguage(this.language);
        break;
      default:
        this.addLanguage(this.language);
        break;
    }
  }

  cancel(): void {
    this.location.back();
  }

  addLanguage(language: ILanguage) {
    this.languageService.addLanguage(language).subscribe(
      (data: ILanguage) => {
        this.languageService.submitLanguage(language);
        this.cancel();
        this.notificationService.success(this.translate
          .instant('components.admin.languages.add-success'), 'X');
      },
      (error) => {
        this.submitted = false
        this.notificationService.error(this.translate
          .instant('common-errors.error-message'), 'X');
      },
    );
  }

  updateLanguage(language: ILanguage) {
    this.languageService.updateLanguage(language).subscribe(
      (data: ILanguage) => {
        this.languageService.submitLanguage(language);
        this.cancel();
        this.notificationService.success(this.translate
          .instant('components.admin.languages.update-success'), 'X');
      },
      (error) => {
        this.submitted = false;
        this.notificationService.error(this.translate
          .instant('common-errors.error-message'), 'X');
      },
    );
  }

  public checkLength(input: HTMLInputElement, maxLength): void {
    if (input.value.length > maxLength) {
      this.form.controls[input.name].setErrors({ maxlength: {requiredLength: maxLength}});
      this.form.controls[input.name].markAsTouched();
      input.value = input.value.substr(0, maxLength);

      clearInterval(this.hideErrorInterval);
      this.hideErrorInterval = setTimeout(() => {
        this.form.controls[input.name].setErrors(null);
        this.form.controls[input.name].markAsTouched();
      }, 2000);
    }
  }
}
