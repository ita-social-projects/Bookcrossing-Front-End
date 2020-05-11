import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {authorUrl, userUrl} from 'src/app/configs/api-endpoint.constants';
import { IUser } from 'src/app/core/models/user';
import {ILocation} from "../../models/location";
import {IAuthor} from "../../models/author";
import {IUserPut} from "../../models/userPut";

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient
  ) {}

  readonly baseUrl = userUrl;

  getUserById(userId: number): Observable<IUser> {
    return this.http.get<IUser>(this.baseUrl + `/${userId}`);
  }

  editUser(userId: number, user: IUserPut) {
    return this.http.put(this.baseUrl + `/${user.id}`, user);
  }

}
