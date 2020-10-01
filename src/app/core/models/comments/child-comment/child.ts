import {IBookOwner} from '../owner';

export interface IChildComment {
  id?: number;
  text: string;
  date: Date;
  owner: IBookOwner;
  isDeleted: boolean;
  comments: IChildComment[];
}
