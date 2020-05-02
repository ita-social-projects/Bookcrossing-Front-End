import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RegistraionService} from '../../../core/services/registration/registraion.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  validemail;

  constructor(private router: Router,
              private regservice: RegistraionService) {
  }

  navigateToSingIn() {
    this.router.navigate(['/login']);
  }

  comparePasswords(a: string, b: string) {
    return a === b;
  }


  async checkEmail(email) {

    this.validemail = ! await this.regservice.checkEmail(email);
    console.log(this.validemail);

  }

  SingUp(form) {
    this.regservice.registration(form.value).subscribe(d => {
      if (d === true) {
        this.navigateToSingIn();
      }
    });
  }

  ngOnInit(): void {
  }

}
