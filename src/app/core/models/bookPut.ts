import { IRoomLocation } from './roomLocation';
import { IAuthor } from "src/app/core/models/author";
import { IGenre } from "src/app/core/models/genre";
export interface IBookPut {
  id?: number;
  name?: string;
  userId?: number;
  publisher?: string;
  available?: boolean;
  bookAuthor?: IAuthor[];
  bookGenre?: IGenre[];
  image?: File;
  notice?: string;
  fieldMasks?: string[];
}
