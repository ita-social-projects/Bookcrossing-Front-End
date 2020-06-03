import {IBookOwner} from '../owner';
import {IChildComment} from '../child-comment/child';

export interface IRootComment {
  id?: number;
  text: string;
  date: Date;
  rating: number;
  bookId: number;
  owner: IBookOwner;
  comments: IChildComment[];
}
