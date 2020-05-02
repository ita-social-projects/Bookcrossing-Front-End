import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {userUrl} from '../../../configs/api-endpoint.constants';

@Injectable({
  providedIn: 'root'
})
export class RegistraionService {
  readonly baseUrl = userUrl;

  constructor(private http: HttpClient) {
  }

 async checkEmail(email) {
    return this.http.get(this.baseUrl + '/email/' + email).toPromise();
  }

  registration(form) {
    return this.http.post(this.baseUrl + '/reg', form);
  }
}
