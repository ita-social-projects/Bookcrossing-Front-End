import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators, NgModel, NgForm} from '@angular/forms';
import {IUserReg} from '../../../core/models/userReg';
import {Router} from '@angular/router';
import {RegistrationService} from '../../../core/services/registration/registration.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private router: Router,
              private regService: RegistrationService,
              private notificationService: NotificationService,
              private translateService: TranslateService) {
  }

  RegistrationForm: FormGroup;
  fieldTextType: boolean;
  repeatFieldTextType: boolean;
  clicked = false;

  ngOnInit(): void {
    this.buildForm();
  }

  isEmail(str:string) {
    var re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (re.test(str)) return true;
      else return false;
  }

  isEmpty(str:string) {
    if (str.trim() == "") return true;
    return false;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }


  comparePasswords(a: string, b: string) {
    return a === b;
  }

  checkPassword(a:string)
  {
    if (a == null) return true;
    let minimumLength = 4;
    if(a.length < minimumLength)
    {
      document.getElementById('hidden').style.display = "block";
      return false;
    }
    else
    {
      document.getElementById('hidden').style.display = "none";
      return true;
    }
  }

  navigateToSignIn() {
    this.router.navigate(['/login']);
  }

  buildForm()
  {
    this.RegistrationForm = new FormGroup({
      name: new FormControl(null),
      surname: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null),
      confirmPassword: new FormControl(null)
    });
  }

  async SignUp(RegistrationForm)
  {
    RegistrationForm.clicked = true;
    RegistrationForm.value.password = RegistrationForm.value.password.trim();
    if(!this.checkPassword(RegistrationForm.value.password)){
       (<HTMLInputElement>document.getElementById('defaultRegisterFormPassword')).value = RegistrationForm.value.password;
       (<HTMLInputElement>document.getElementById('defaultRegisterFormConfirmPassword')).value = "";
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
      (error) => {
        //console.log(error);
        (<HTMLInputElement>document.getElementById('defaultRegisterFormPassword')).value = '';
        (<HTMLInputElement>document.getElementById('defaultRegisterFormConfirmPassword')).value = '';
        this.notificationService.error(
          this.translateService.instant('E-mail is already registered'),
          'X'
        );
      }
    );
  }


  getFormData(user: IUserReg): FormData {
    const formData = new FormData();
    Object.keys(user).forEach((key, index) => {if (user[key]) formData.append(key, user[key]);});
    return formData;
  }
}
