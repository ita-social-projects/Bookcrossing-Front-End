import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SuggestionMessageService } from 'src/app/core/services/suggestion-message/suggestion-message.service';
import { ISuggestionMessage } from 'src/app/core/models/suggestion-message/suggestion-message';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { IUserInfo } from 'src/app/core/models/userInfo';
import { IssueService} from 'src/app/core/services/issue/issue';
import { IIssue } from 'src/app/core/models/issue';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  providers: [SuggestionMessageService, IssueService]
})

export class ContactsComponent implements OnInit {
  email = 'support@bookcrossing.tech';
  emailString: string;
  contactsForm: FormGroup;
  summaryStates: Array<string>;
  public filteredStates: Array<string>;
  public id: number;
  private user: IUserInfo;

  constructor(
    private messageService: SuggestionMessageService,
    private authentification: AuthenticationService,
    private userService: UserService,
    private translationService: TranslateService,
    private notificationService: NotificationService,
    private issueService: IssueService,
    private router: Router) {}

  ngOnInit(): void {
    this.getAllIssues();
    this.buildForm();
    this.userInfo();
  }

  openEmail() {
    this.emailString = 'mailto:' + this.email + '?subject=Need support';
  }

  public buildForm(): void {
    this.contactsForm = new FormGroup({
      summary: new FormControl('', [Validators.required]),
      summaryFilter: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(1)])
    });
  }

  public onSubmit() {
    const message: ISuggestionMessage = {
      userId: this.user.id,
      userFirstName: this.user.firstName,
      userLastName: this.user.lastName,
      userEmail: this.user.email,
      summary: this.contactsForm.get('summary').value,
      text: this.contactsForm.get('description').value
    };

    this.messageService.postMessage(message).subscribe(
      (data: ISuggestionMessage) => {
        this.messageService.submitMessage(message);
        this.notificationService.success(
          this.translationService.instant('components.admin.suggestion-message.message-sent-success'),
        'X'
      );
        this.router.navigate(['.']);
      });
  }

  public getAllIssues(): void {
    this.issueService.getIssue().subscribe(
      (data) => {
        this.summaryStates = data.map(a => a.name);
        this.filteredStates = this.summaryStates.slice();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public async getUserId(): Promise<number> {
    const recieve = 100;

    const promice = new Promise<number>((resolve) => {
      this.authentification.getUserId().subscribe({
        next: (value: number) => {
          if (value) {
            resolve(value);
          }
        },
        error: () => {
          resolve(0);
        },
      });
    });

    await promice.then((value) => (this.id = value));
    return this.id;
  }

  public async userInfo(): Promise<void> {
    await this.getUserId().then(() => this.getUserById());
  }

  public getUserById(): void {
    this.userService.getUserById(this.id).subscribe((user) => {
      this.user = user;
    });
  }



}
