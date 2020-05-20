import { Component, OnInit } from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {NotificationService} from "../../../../core/services/notification/notification.service";
import {TranslateService} from "@ngx-translate/core";
import { AuthenticationService } from "src/app/core/services/authentication/authentication.service";

@Component({
  selector: "app-email-conf",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private fb: FormBuilder
  ) {}

  forgotPasswordForm = this.fb.group({
    Email: [
      "",
      [Validators.required, Validators.email]
    ],
  });

  onSubmit() {
    this.authService.forgotPassword(this.forgotPasswordForm.value.Email).subscribe(() => {
      this.notificationService.success(this.translate
        .instant("components.password.forgot-success"), "X");
    }, err => {
      this.notificationService.error(this.translate
        .instant("components.password.forgot-error"), "X");
    });
  }

  ngOnInit(): void {
  }
}
