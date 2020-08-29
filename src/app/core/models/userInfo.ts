import { IRole } from './role';
import { IToken } from './token';
import { IUser } from './user';

export interface IUserInfo extends IUser {
  numberOfBooksOwned?: number;
  role: IRole;
  token: IToken;
  isDeleted: boolean;
}
