import {Injectable, EventEmitter, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { map, take } from 'rxjs/operators';
import {loginUrl} from '../../../configs/api-endpoint.constants';
import {userUrl} from '../../../configs/api-endpoint.constants';
import {IUser} from '../../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({providedIn: 'root'})
export class AuthenticationService {
  loginEvent = new EventEmitter();
  logoutEvent = new EventEmitter();
  readonly baseUrl = loginUrl;
  readonly userUrl = userUrl;
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  getLoginEmitter() {
    return this.loginEvent;
  }

  getLogoutEmitter() {
    return this.logoutEvent;
  }

  constructor(private http: HttpClient,
              private jwtHelper: JwtHelperService) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }

  login(form) {
    return this.http.post<any>(this.baseUrl, form)
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('RememberMe', form.RememberMe);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.loginEvent.emit();
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
  isAuthenticated() {
    const token: string = localStorage.getItem('currentUser');
    return token && !this.jwtHelper.isTokenExpired(token);
  }

 getUserId() {
    return this.http.get(`${this.userUrl}/id/`);
  }

  isAdmin() {
    return this.getUserRole() === 'Admin';
  }

  getUserRole() {
    const token: string = localStorage.getItem('currentUser');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const role = this.jwtHelper.decodeToken(token)[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];
      return role;
    }
  }
}
