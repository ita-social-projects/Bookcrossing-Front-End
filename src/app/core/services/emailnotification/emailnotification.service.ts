import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { userUrl } from '../../../configs/api-endpoint.constants';


@Injectable({ providedIn: 'root' })
export class EmailNotificationService {

  readonly userUrl = userUrl;

  constructor(private http: HttpClient)
   {}

  forbidEmail(mail, num) {
    return this.http.put(`${this.userUrl}/email/`, {email: mail, code: num});
  } 
}
