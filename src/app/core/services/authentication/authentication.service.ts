import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {loginUrl} from '../../../configs/api-endpoint.constants';
import {userUrl} from '../../../configs/api-endpoint.constants';
import { IUser } from '../../models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  readonly baseUrl = loginUrl;
  readonly passwordUrl = userUrl;
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }

  login(form) {
    console.log('auth service')
    return this.http.post<any>(this.baseUrl, form)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
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
