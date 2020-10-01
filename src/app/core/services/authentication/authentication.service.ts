import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { loginUrl, refreshTokenUrl } from '../../../configs/api-endpoint.constants';
import { userUrl } from '../../../configs/api-endpoint.constants';
import { IUserInfo } from '../../models/userInfo';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IToken } from '../../models/token';
import { UserService } from '../user/user.service';
import { DialogService } from '../dialog/dialog.service';
import {AppConfig} from '../../../configs/app.config';
import {MsalService} from '@azure/msal-angular';
import {Router, RouterStateSnapshot} from '@angular/router';
import {RegistrationService} from '../registration/registration.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Account, UserAgentApplication} from 'msal';
import { CookieService } from 'ngx-cookie-service';
import { ILocationHome } from '../../models/locationHome';
import { LocationHomeService } from '../locationHome/locationHome.service';

export enum AuthenticationMethod {
  AzureActiveDirectory,
  LoginPassword
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  loginEvent = new EventEmitter();
  logoutEvent = new EventEmitter();

  readonly baseUrl = loginUrl;
  readonly userUrl = userUrl;
  readonly refreshUrl = refreshTokenUrl;

  private currentUserSubject: BehaviorSubject<IUserInfo>;
  public currentUser: Observable<IUserInfo>;
  public AuthMethod: AuthenticationMethod;
  public isValid = false;

  private static azureLogout(): void {
    // make window appearing in center
    const windowWidth = 500;
    const windowHeight = 600;
    const y = window.top.outerHeight / 2 + window.top.screenY - ( windowHeight / 2);
    const x = window.top.outerWidth / 2 + window.top.screenX - ( windowWidth / 2);
    const popup = window.open(`https://login.microsoftonline.com/logout.srf`,
      'logout',
      `width=${windowWidth},height=${windowHeight},top=${y}, left=${x}`);
    popup.focus();
  }

  public getLoginEmitter(): EventEmitter<any> {
    return this.loginEvent;
  }

  public getLogoutEmitter(): EventEmitter<any> {
    return this.logoutEvent;
  }

  constructor(private jwtHelper: JwtHelperService,
              private dialogService: DialogService,
              private userService: UserService,
              private msalService: MsalService,
              private router: Router,
              private locationHomeService: LocationHomeService,
              private registrationService: RegistrationService,
              private http: HttpClient,
              private cookie: CookieService) {
    this.currentUserSubject = new BehaviorSubject<IUserInfo>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.AuthMethod = AuthenticationMethod[AppConfig.authConfiguration];
  }

  public get currentUserValue(): IUserInfo {
    return this.currentUserSubject.value;
  }


  login(form) {
    return this.http.post<IUserInfo>(this.baseUrl, form)
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('RememberMe', form.RememberMe);

          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log('user creds is ', user);
          this.currentUserSubject.next(user);
          this.loginEvent.emit();

          this.userService.getUserById(user.id).subscribe(userInfo => {
            if (user.role?.user[0]?.locationHomeId != null) {
              this.locationHomeService.getLocationHomeById(user.role?.user[0]?.locationHomeId).subscribe(location => {
                if ((location?.isActive || userInfo?.userLocation?.location?.isActive) === false) {
                  this.dialogService.openLocationDialog(userInfo);
                }
              });
            } else {
              if (userInfo?.userLocation?.location?.isActive === false) {
                this.dialogService.openLocationDialog(userInfo);
              }
            }
          });
        }
        return user;
      }));
  }

  public async loginActiveDirectory(): Promise<void> {
    await this.msalService.loginPopup();
    const account = this.msalService.getAccount();
    const loginForm = new FormGroup({
      Email: new FormControl(account.userName),
      AzureId: new FormControl(account.accountIdentifier)
    });
    this.login(loginForm.value).subscribe();
    if (!this.isAuthenticated()) {
      this.registrationService.registerAzureAccount(account).subscribe(
        () => {
          this.login(loginForm.value).subscribe();
        }
      );
    }
  }

  public redirectToLogin(): void {
    switch (this.AuthMethod) {
      case AuthenticationMethod.AzureActiveDirectory:
        this.loginActiveDirectory();
        break;
      case AuthenticationMethod.LoginPassword:
        this.router.navigate(['/login']);
        break;
    }
  }

  public logout(): void {
    localStorage.removeItem('RememberMe');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    if (this.msalService.getAccount()) {
      sessionStorage.clear();
      this.cookie.delete(`msal.${AppConfig.activeDirectoryConfig.clientId}.client.info`);
      this.cookie.delete(`msal.${AppConfig.activeDirectoryConfig.clientId}.idtoken`);
      AuthenticationService.azureLogout();
      window.location.reload();
    }
    this.logoutEvent.emit();
  }

  public refresh(Token: IToken): Observable<IUserInfo> {
      return this.http.post<IUserInfo>(this.refreshUrl, Token).pipe(tap(user => {
      console.log('received refresh ', user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.loginEvent.emit();
    }));
  }

  public resetPassword(Password, PasswordConfirmation, Email, ConfirmationNumber): Observable<object> {
    return this.http.put(`${this.userUrl}/password/`, {
      Password,
      PasswordConfirmation,
      Email,
      ConfirmationNumber
    });
  }

  public forgotPassword(email) {
    return this.http.post(`${this.userUrl}/password/`, {
      email
    });
  }

  public async validateLocation(): Promise<boolean> {
    const userInfo = await this.userService.getUserById(this.currentUserValue.id).toPromise();
    const locationId = userInfo?.role?.user[0]?.locationHomeId;
    const This = this;
    if (locationId != null) {
      this.locationHomeService.getLocationHomeById(locationId).subscribe(location => {
        This.isValid = (location?.isActive || userInfo?.userLocation?.location?.isActive);
        if (This.isValid === false) {
          return this.dialogService.openLocationDialog(userInfo)
            .afterClosed().toPromise();
        }
      });
    } else {
      This.isValid = userInfo?.userLocation?.location?.isActive;
      if (This.isValid === false) {
      return this.dialogService.openLocationDialog(userInfo)
            .afterClosed().toPromise();
      }
    }
    return This.isValid;
  }

  public isAuthenticated(): boolean {
    const token: string = localStorage.getItem('currentUser');
    return token !== null;
  }

  public getUserId(): Observable<number> {
      return this.http.get<number>(`${this.userUrl}/id/`);
  }

  public isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  public getUserRole() {
    const token: string = localStorage.getItem('currentUser');
    if (token) {
      const role = this.jwtHelper.decodeToken(token)[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
      return role;
    }
  }
}
