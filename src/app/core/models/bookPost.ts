import { IRoomLocation } from './roomLocation';
import { IAuthor } from "src/app/core/models/author";
import { IGenre } from "src/app/core/models/genre";
export interface IBookPost {
  id?: number;
  name: string;
  userId: number;
  publisher?: string;
  available: boolean;
  authors: IAuthor[];
  genres: IGenre[];
  image?: File;
  notice?: string;
}
