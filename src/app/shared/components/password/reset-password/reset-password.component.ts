import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NotificationService } from "src/app/core/services/notification/notification.service";
import { Router, ActivatedRoute } from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import { AuthenticationService } from "src/app/core/services/authentication/authentication.service";
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent implements OnInit {
  confirmed: boolean;
  hide = true;
  code: number;
  email: string;

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private fb: FormBuilder
  ) {}

  confirmPasswordForm = this.fb.group({
    Password: [
      "",
      [Validators.required, Validators.minLength(6), Validators.maxLength(50)]
    ],
    ConfirmPassword: [
      "",
      [Validators.required, Validators.minLength(6), Validators.maxLength(50)]
    ]
  });

  ngOnInit() {
    this.confirmed = false;
    this.route.queryParams.subscribe(query => {
      this.email = query.email;
      this.code = query.number;
    });
  }

  onSubmit() {
    this.authService.resetPassword(
      this.confirmPasswordForm.value.Password,
      this.confirmPasswordForm.value.ConfirmPassword,
      this.email,
      this.code
    ).subscribe(() => {
      this.router.navigateByUrl("/login");
    }, err => {
      this.notificationService.warn(this.translate
        .instant("components.password.reset-error"));
    });
  }
}
