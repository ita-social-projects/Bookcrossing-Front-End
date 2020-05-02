import {Injectable, EventEmitter, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {loginUrl} from '../../../configs/api-endpoint.constants';
import {userUrl} from '../../../configs/api-endpoint.constants';
import {IUser} from '../../models/user';


@Injectable({providedIn: 'root'})
export class AuthenticationService {
  loginEvent = new EventEmitter();
  logoutEvent = new EventEmitter();
  readonly baseUrl = loginUrl;
  readonly passwordUrl = userUrl;
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  getLoginEmitter() {
    return this.loginEvent;
  }

  getLogoutEmitter() {
    return this.logoutEvent;
  }

  constructor(private http: HttpClient) {
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
    return this.http.put(`${this.passwordUrl}/password/`, {
      Password,
      PasswordConfirmation,
      Email,
      ConfirmationNumber
    });
  }

  forgotPassword(email) {
    return this.http.post(`${this.passwordUrl}/password/`, {
      email
    });
  }
}
