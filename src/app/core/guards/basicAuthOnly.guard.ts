import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationMethod, AuthenticationService} from '../services/authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class BasicAuthOnlyGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.AuthMethod === AuthenticationMethod.LoginPassword) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
