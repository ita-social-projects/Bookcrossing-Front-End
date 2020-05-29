import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  redirectUrl: string;
  loading = false;
  Isinvalid = false;
  submitted = false;
  returnUrl: string;
  error = '';
  password: string;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/books']);
    }
  }

  navigateToSingUp() {
    this.router.navigate(['/registration']);
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params['returnUrl'];
    });
    /*    this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
        });*/
  }


  singIn(loginFrom) {
    this.authenticationService.login(loginFrom.value)
      .pipe(first())
      .subscribe(
        data => {
          if(typeof this.redirectUrl !== 'undefined'){
            this.router.navigate([`${this.redirectUrl}`]);
          }
          else{
            this.router.navigate(['/books']);
          }
        },
        error => {
          this.Isinvalid = true;
          this.error = error;
          this.loading = false;
          this.password = '';
        });
  }
}
