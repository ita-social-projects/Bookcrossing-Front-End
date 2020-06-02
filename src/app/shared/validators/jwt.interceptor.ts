import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import {catchError, switchMap, tap} from "rxjs/operators";
import {error} from "@angular/compiler/src/util";

import {IUser} from "../../core/models/user";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  private isRefreshing = false;
  private refreshTokenSubject:BehaviorSubject<any> = new BehaviorSubject<any>(null);

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = this.authenticationService.isAuthenticated();
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = this.addToken(request,currentUser.token.jwt);
    }

   return next.handle(request).pipe(catchError(err => {
     if(err instanceof HttpErrorResponse && err.status===401){
       console.log('caught error in intercept');
       return this.handle401error(request,next,currentUser);
     }else{
       return throwError(err);
     }
   }));
  }

 private handle401error(request:HttpRequest<any>,next:HttpHandler,currentUser : IUser){
     this.refreshTokenSubject.next(null);
       return this.authenticationService.refresh(currentUser.token).pipe(switchMap((token: IUser) => {
       this.isRefreshing = false;
       console.log('in handle 401 error i got',token);
       this.refreshTokenSubject.next(token.token.refreshToken);
       return next.handle(this.addToken(request,token.token.jwt));
     }));



 }


  private addToken(request:HttpRequest<any>,token:string){
    return request.clone({
      setHeaders:{
        'Authorization': `Bearer ${token}`
      }
    })
  }

}
