import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message/message.service';
import {IMessage} from 'src/app/core/models/message';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { IUserInfo } from 'src/app/core/models/userInfo';
import { IssueService} from 'src/app/core/services/issue/issue';
import { IIssue } from 'src/app/core/models/issue';
import { forEach } from 'lodash';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  providers: [MessageService, IssueService]
})

export class ContactsComponent implements OnInit {
  email = 'support@bookcrossing.tech';
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
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
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
    this.userInfo();
    console.log(this.user);
    let userMessage: IMessage;
    userMessage = {};
    userMessage.user = this.authentification.currentUserValue;
    userMessage.summary = this.contactsForm.get('summary').value;
    userMessage.text = this.contactsForm.get('description').value;
    console.log(userMessage.user);
    console.log(userMessage);
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
    console.log('id :' + this.id);

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
