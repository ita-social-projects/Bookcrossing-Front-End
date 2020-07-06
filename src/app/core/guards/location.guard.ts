import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LocationGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private dialogService: DialogService
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    if (this.authService.isAuthenticated) {
      return this.authService.validateLocation();
    }
    return false;
  }
}
