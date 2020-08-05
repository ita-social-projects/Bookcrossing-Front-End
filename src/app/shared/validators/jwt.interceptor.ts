import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import {catchError, filter, switchMap, take, tap} from "rxjs/operators";
import {error} from "@angular/compiler/src/util";

import {IUserInfo} from "../../core/models/userInfo";


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

   return next.handle(request).pipe(catchError( err => {
     console.log('caught error in intercept ',err);

     if(err instanceof HttpErrorResponse) {
       if (err.status === 401) {
         if (err.headers.get("Token-Expired")) {
           console.log("I got header token expired ")
           return this.handle401error(request, next, currentUser);
         }
       }

       return throwError(err);
     }else{
       return throwError(err);
     }
   }));
  }

 private handle401error(request:HttpRequest<any>,next:HttpHandler,currentUser : IUserInfo){
     if(!this.isRefreshing) {
       console.log('Token is not refreshing, so can be refreshed');
       this.isRefreshing = true;
       this.refreshTokenSubject.next(null);
       return this.authenticationService.refresh(currentUser.token).pipe(switchMap((token: IUserInfo) => {
         console.log('in handle 401 error i got', token);
         this.refreshTokenSubject.next(token.token.jwt);
         this.isRefreshing = false;
         return next.handle(this.addToken(request, token.token.jwt));
       }));
     }else{
       console.log('Token is being expired, so waiting...');
       return this.refreshTokenSubject.pipe(
         filter(token=>token!=null),
         take(1),
         switchMap(jwt=>{
           console.log('wtf');
         return next.handle(this.addToken(request,jwt))
         })

       )
     }


 }


  private addToken(request:HttpRequest<any>,token:string){
    return request.clone({
      setHeaders:{
        'Authorization': `Bearer ${token}`
      }
    })
  }

}
