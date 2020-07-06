import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { loginUrl, refreshTokenUrl } from '../../../configs/api-endpoint.constants';
import { userUrl } from '../../../configs/api-endpoint.constants';
import { IUser } from '../../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IToken } from "../../models/token";
import { MatDialog } from '@angular/material/dialog';
import { LocationPopupComponent } from 'src/app/shared/components/location-popup/location-popup.component';
import { UserService } from '../user/user.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  loginEvent = new EventEmitter();
  logoutEvent = new EventEmitter();

  readonly baseUrl = loginUrl;
  readonly userUrl = userUrl;
  readonly refreshUrl = refreshTokenUrl;

  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  getLoginEmitter() {
    return this.loginEvent;
  }

  getLogoutEmitter() {
    return this.logoutEvent;
  }

  constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private dialogService: DialogService,
    private userService: UserService) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }

  login(form) {
    return this.http.post<IUser>(this.baseUrl, form)
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('RememberMe', form.RememberMe);
          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log('user creds is ', user);
          this.currentUserSubject.next(user);
          this.loginEvent.emit();

          this.userService.getUserById(user.id).subscribe(userInfo => {
            if (!userInfo.userLocation?.location?.isActive) {
              this.dialogService.openLocationDialog(userInfo);
            }
          });
        }
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('RememberMe');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.logoutEvent.emit();
  }

  refresh(Token: IToken) {
    return this.http.post<IUser>(this.refreshUrl, Token).pipe(tap(user => {
      console.log('received refresh ', user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.loginEvent.emit();
    }));
  }


  resetPassword(Password, PasswordConfirmation, Email, ConfirmationNumber) {
    return this.http.put(`${this.userUrl}/password/`, {
      Password,
      PasswordConfirmation,
      Email,
      ConfirmationNumber
    });
  }

  forgotPassword(email) {
    return this.http.post(`${this.userUrl}/password/`, {
      email
    });
  }

  async validateLocation(): Promise<boolean> {
    const userId = this.currentUserValue.id;
    const userInfo = await this.userService.getUserById(userId).toPromise();

    let hasActiveLocation = userInfo.userLocation?.location?.isActive;
    if (!hasActiveLocation) {
      return this.dialogService.openLocationDialog(userInfo)
        .afterClosed().toPromise();
    }
    
    return hasActiveLocation;
  }

  isAuthenticated() {
    const token: string = localStorage.getItem("currentUser");
    return token !== null;
  }

  getUserId() {
    return this.http.get(`${this.userUrl}/id/`)
  }

  isAdmin() {
    return this.getUserRole() === 'Admin';
  }

  getUserRole() {
    const token: string = localStorage.getItem('currentUser');
    if (token) {
      const role = this.jwtHelper.decodeToken(token)[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
      return role;
    }
  }
}
