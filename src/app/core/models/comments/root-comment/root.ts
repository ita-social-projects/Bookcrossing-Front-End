import {IBookOwner} from '../owner';
import {IChildComment} from '../child-comment/child';

export interface IRootComment {
  id?: number;
  text: string;
  date: Date;
  bookId: number;
  owner: IBookOwner;
  isDeleted: boolean;
  comments: IChildComment[];
}
