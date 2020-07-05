import {Component, OnInit} from '@angular/core';
import { NgModule }      from '@angular/core';
import { FormControl, FormGroup, Validators, NgModel, NgForm} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import {IUserReg} from '../../../core/models/UserReg';
import {Router} from '@angular/router';
import {RegistrationService} from '../../../core/services/registration/registration.service';
import { IUser } from 'src/app/core/models/user';
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
  
  ngOnInit(): void {
    this.buildForm();
  }

  isEmail(str:string) {
    var re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (re.test(str)) return true;
      else return false;
  }

  comparePasswords(a: string, b: string) {
    return a === b;
  }

  checkPassword(a:string)
  {
    let minimumLength = 4;
    return a.length >= minimumLength;      //length of password should be 4 symbols or more
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