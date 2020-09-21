import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message/message.service';
import { IUserMessage } from 'src/app/core/models/userMessage';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { IUserInfo } from 'src/app/core/models/userInfo';
import { IssueService} from 'src/app/core/services/issue/issue';
import { IIssue } from 'src/app/core/models/issue';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  providers: [MessageService, IssueService]
})

export class ContactsComponent implements OnInit {
  email = 'support@bookcrossing.tech';
  emailString: string;
  contactsForm :FormGroup;
  summaryStates: Array<string>;
  public filteredStates: Array<string>;
  public id: number;
  private user: IUserInfo;

  constructor(private messageService: MessageService, private authentification: AuthenticationService,
    private userService: UserService, private issueService: IssueService) {}

  ngOnInit(): void {
    this.getAllIssues();
    this.buildForm();
    this.userInfo();
  }

  openEmail()
  {
    this.emailString = "mailto:"+ this.email + "?subject=Need support";
  }

  public buildForm(): void {
    this.contactsForm = new FormGroup({ 
      summary: new FormControl('', [Validators.required]),
      summaryFilter: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(1)])
    });
  }

  public onSubmit()
  {
    let userMessage: IUserMessage;
    userMessage = {}
    userMessage.userId = this.user.id;
    userMessage.userFirstName = this.user.firstName;
    userMessage.userLastName = this.user.lastName;
    userMessage.userEmail = this.user.email;
    userMessage.summary = this.contactsForm.get('summary').value;
    userMessage.text = this.contactsForm.get('description').value;
    this.messageService.postMessage(userMessage);
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
