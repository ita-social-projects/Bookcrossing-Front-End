import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IIssue } from 'src/app/core/models/issue';
import { IssueService } from 'src/app/core/services/issue/issue.service';

@Component({
  selector: 'app-issue-form',
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.scss']
})

export class IssueFormComponent implements OnInit {
  issue: IIssue;
  title: string;
  submitButtonText: string;
  form: FormGroup;
  hideErrorInterval: NodeJS.Timeout;
  submitted = false;


  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private issueService: IssueService
  ) { }

  ngOnInit(): void {
    this.getRequestType();
    this.buildForm();
  }

  public getRequestType(): void {
    if (this.issueService.formIssue?.id) {
      this.issue = this.issueService.formIssue;
    }
    this.translateText();
  }

  private translateText(): void {
    this.title = 'components.admin.issues-form.edit-title';
    this.submitButtonText =
      'components.admin.issues-form.edit-button';
  }

  public buildForm(): void {
    this.form = new FormGroup({
      id: new FormControl({ value: this.issue.id, disabled: true }),
      name: new FormControl(this.issue.name, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        /* tslint:disable */
        Validators.pattern("^([(a-zA-Z ||а-щА-ЩЬьЮюЯяЇїІіЄєҐґыЫэЭ )'-]+)$"),
        /* tslint:enable */
      ]),
    });
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitted) {
      return;
    }
    this.submitted = true;
    this.issue = {
      name: this.form.get('name').value,
    };
    this.issue.id = this.form.get('id').value;
    this.updateIssue(this.issue);
  }

  public cancel(): void {
    this.location.back();
  }

  public updateIssue(issue: IIssue): void {
    this.issueService.updateIssue(issue).subscribe(
      (data: IIssue) => {
        this.issueService.submitIssue(issue);
        this.cancel();
        this.notificationService.success(
          this.translate.instant('components.admin.issues.update-success'),
          'X'
        );
      },
      () => {
        this.submitted = false;
        this.notificationService.error(
          this.translate.instant('common-errors.error-message'),
          'X'
        );
      }
    );
  }

  public checkLength(input: HTMLInputElement, maxLength): void {
    if (input.value.length > maxLength) {
      this.form.controls[input.name].setErrors({
        maxlength: { requiredLength: maxLength },
      });
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
