import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FormGroup} from '@angular/forms'; 
import { NotificationService } from "src/app/core/services/notification/notification.service";
import { ActivatedRoute } from "@angular/router";
import { EmailNotificationService } from "src/app/core/services/emailnotification/emailnotification.service";

@Component({
  selector: "app-email-notification-forbid",
  templateUrl: "./email-notification-forbid.component.html",
  styleUrls: ["./email-notification-forbid.component.css"]
  
})
export class ForbidEmailComponent implements OnInit {
  email: string;
  number:string;
  Form: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private emailService: EmailNotificationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(query => {
      this.email = query.email;
      this.number = query.number;
      if (this.email == null || this.number == null)
      {
        document.body.innerHTML = ""; 
      }
    });
  }

  
  Yes():void {
    this.emailService.forbidEmail(
      this.email, this.number
    ).subscribe(() => {
      this.notificationService.success(this.translate
        .instant("Success"), "X");
    }, err => {
      this.notificationService.error(this.translate
        .instant("Something went wrong"), "X");
    });
  }


  No():void {
    document.body.innerHTML = ""; 
    window.close();
  }
}
