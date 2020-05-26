import { IRoomLocation } from './roomLocation';
import { IAuthor } from "src/app/core/models/author";
import { IGenre } from "src/app/core/models/genre";
import {bookState} from './bookState.enum';
export interface IBookPut {
  id?: number;
  name?: string;
  userId?: number;
  publisher?: string;
  state?: bookState;
  bookAuthor?: IAuthor[];
  bookGenre?: IGenre[];
  image?: File;
  notice?: string;
  fieldMasks?: string[];
}
