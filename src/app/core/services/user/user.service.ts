import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { userUrl } from "src/app/configs/api-endpoint.constants";
import { IUser } from 'src/app/core/models/user';

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient
  ) {}

  readonly baseUrl = userUrl;

  getUserById(userId: number) :Observable<IUser>{
    return this.http.get<IUser>(this.baseUrl + `/${userId}`);
  }
}
