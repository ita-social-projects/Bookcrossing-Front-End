import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  NgModel,
  NgForm,
} from '@angular/forms';
import { IUserReg } from '../../../core/models/userReg';
import { Router } from '@angular/router';
import { RegistrationService } from '../../../core/services/registration/registration.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  constructor(
    private router: Router,
    private regService: RegistrationService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  public RegistrationForm: FormGroup;
  public fieldTextType: boolean;
  public repeatFieldTextType: boolean;
  public clicked = false;

  public ngOnInit(): void {
    this.buildForm();
  }

  public isEmail(str: string): boolean {
    const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (re.test(str)) {
      return true;
    } else {
      return false;
    }
  }

  public isEmpty(str: string): boolean {
    if (str.trim() === '') {
      return true;
    }
    return false;
  }

  public toggleFieldTextType(): void {
    this.fieldTextType = !this.fieldTextType;
  }

  public toggleRepeatFieldTextType(): void {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  public comparePasswords(a: string, b: string): boolean {
    return a === b;
  }

  public checkPassword(a: string): boolean {
    if (a == null) {
      return true;
    }
    const minimumLength = 4;
    if (a.length < minimumLength) {
      document.getElementById('hidden').style.display = 'block';
      return false;
    } else {
      document.getElementById('hidden').style.display = 'none';
      return true;
    }
  }

  public navigateToSignIn(): void {
    this.router.navigate(['/login']);
  }

  public buildForm(): void {
    this.RegistrationForm = new FormGroup({
      name: new FormControl(null),
      surname: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null),
      confirmPassword: new FormControl(null),
    });
  }

  public async SignUp(RegistrationForm): Promise<void> {
    RegistrationForm.clicked = true;
    RegistrationForm.value.password = RegistrationForm.value.password.trim();
    if (!this.checkPassword(RegistrationForm.value.password)) {
      (document.getElementById(
        'defaultRegisterFormPassword'
      ) as HTMLInputElement).value = RegistrationForm.value.password;
      (document.getElementById(
        'defaultRegisterFormConfirmPassword'
      ) as HTMLInputElement).value = '';
      RegistrationForm.clicked = false;
      return;
    }
    this.regService.registrate(RegistrationForm.value).subscribe(
      (data: IUserReg) => {
        this.notificationService.success(
          this.translateService.instant('You are registered successfully'),
          'X'
        );
        this.navigateToSignIn();
      },
      () => {
        (document.getElementById(
          'defaultRegisterFormPassword'
        ) as HTMLInputElement).value = '';
        (document.getElementById(
          'defaultRegisterFormConfirmPassword'
        ) as HTMLInputElement).value = '';
        this.notificationService.error(
          this.translateService.instant('E-mail is already registered'),
          'X'
        );
      }
    );
  }

  public getFormData(user: IUserReg): FormData {
    const formData = new FormData();
    Object.keys(user).forEach((key, index) => {
      if (user[key]) {
        formData.append(key, user[key]);
      }
    });
    return formData;
  }
}
