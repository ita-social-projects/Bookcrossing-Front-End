import { IBook } from './book'
import { IUserInfo } from './userInfo'
export interface IRequest {
  id: number;
  book: IBook;
  owner: IUserInfo;
  user: IUserInfo;
  requestDate: Date;
  receiveDate?: Date;
}
