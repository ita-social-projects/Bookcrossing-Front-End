import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {authorUrl, userUrl} from 'src/app/configs/api-endpoint.constants';
import { IUserInfo } from 'src/app/core/models/userInfo';
import {ILocation} from '../../models/location';
import {IAuthor} from '../../models/author';
import {IUserPut} from '../../models/userPut';
import { CompletePaginationParams } from '../../models/Pagination/completePaginationParameters';
import { PaginationService } from '../../services/pagination/pagination.service';
import { IPage } from '../../models/page';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private paginationService: PaginationService
  ) {
  }

  readonly baseUrl = userUrl;

  public getUsers(params: CompletePaginationParams): Observable<IPage<IUserInfo>> {
    return this.paginationService.getPaginatedPage<IUserInfo>(this.baseUrl + '/paginated', params);
  }

  public getUserById(userId: number): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(this.baseUrl + `/${userId}`);
  }

  public editUser(userId: number, user: IUserPut): Observable<object> {
    return this.http.put(this.baseUrl + `/${user.id}`, user);
  }

}
