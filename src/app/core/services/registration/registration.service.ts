import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {userUrl} from '../../../configs/api-endpoint.constants';
import { IUserReg } from '../../models/userReg';
import { Observable } from 'rxjs';
import {Account} from 'msal';
import {FormControl, FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  readonly baseUrl = userUrl;

  constructor(private http: HttpClient) {
  }

  public registrate(user): Observable<IUserReg> {
    return this.http.post<IUserReg>(this.baseUrl, user);
  }

  public registerAzureAccount(account: Account): Observable<IUserReg> {
    const registerForm = new FormGroup({
      FirstName: new FormControl(account.name.split(' ')[0]),
      LastName: new FormControl(account.name.split(' ')[1]),
      AzureId: new FormControl(account.accountIdentifier),
      email: new FormControl(account.userName),
    });
    return this.registrate(registerForm.value);
  }
}
