import { IRoomLocation } from './roomLocation';
import { IAuthor } from 'src/app/core/models/author';
import { IGenre } from 'src/app/core/models/genre';
import { bookState } from './bookState.enum';
export interface IBookPost {
  id?: number;
  name: string;
  userId: number;
  publisher?: string;
  state: bookState;
  authors: IAuthor[];
  genres: IGenre[];
  image?: File;
  notice?: string;
  languageId: number;
}
