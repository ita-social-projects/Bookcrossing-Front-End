import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  redirectUrl: string;
  loading = false;
  Isinvalid = false;
  submitted = false;
  returnUrl: string;
  error = '';
  
  @ViewChild('loginElement', {static: true, read: NgForm}) loginForm: NgForm;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private cookieService: CookieService,) {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/books']);
    }    
  }

  navigateToSingUp() {
    this.router.navigate(['/registration']);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params.returnUrl;      
    });

    if(this.cookieService.get('remember')!==undefined){
      if(this.cookieService.get('remember')==="Yes"){
        this.loginForm.control.value.Email =this.cookieService.get('email');
        this.loginForm.control.value.Password = this.cookieService.get('password');
      }
    }
  }

  singIn(loginForm) {
    if(loginForm.value.RememberMe) {
      this.cookieService.set('remember',"Yes");
      this.cookieService.set('email',loginForm.value.Email);
      this.cookieService.set('password',loginForm.value.Password);
    } else {
      this.cookieService.set('remember',"No");
      this.cookieService.set('email',"");
      this.cookieService.set('password',"");
    }
    this.authenticationService.login(loginForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if (typeof this.redirectUrl !== 'undefined') {
            this.router.navigate([`${this.redirectUrl}`]);
          } else {
            this.router.navigate(['/']);
          }
        },
        error => {
          this.Isinvalid = true;
          this.error = error;
          this.loading = false;
        });
  }
}
