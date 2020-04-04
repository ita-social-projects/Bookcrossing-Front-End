import { IBook } from './book'
import { IUser } from './user'
export interface IRequest {
  id: number;
  book: IBook;
  owner: IUser;
  user: IUser;
  requestDate: Date;
  receiveDate?: Date;
}
