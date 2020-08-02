import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {userUrl} from '../../../configs/api-endpoint.constants';
import { IUserReg } from "../../models/UserReg";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  readonly baseUrl = userUrl;

  constructor(private http: HttpClient) {
  }

  registrate(user):Observable<IUserReg> {
    return this.http.post<IUserReg>(this.baseUrl, user);
  }
}
