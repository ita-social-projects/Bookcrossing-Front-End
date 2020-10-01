import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  public isAuthenticated(): boolean {
    return this.authenticationService.isAuthenticated();
  }

  redirectToLogin() {
    this.router.navigate(['login'], { queryParams: { returnUrl: '/contacts'} });
  }

}
