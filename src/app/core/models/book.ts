import { IRoomLocation } from './roomLocation';
import { IAuthor } from 'src/app/core/models/author';
import { IGenre } from 'src/app/core/models/genre';
import { bookState } from './bookState.enum';
import { ILanguage } from './language';
export interface IBook {
  id?: number;
  name: string;
  userId: number;
  publisher?: string;
  state: bookState;
  authors: IAuthor[];
  rating: number;
  predictedRating?: number;
  genres: IGenre[];
  imagePath?: string;
  notice?: string;
  location: IRoomLocation;
  language: ILanguage;
  isbn?: string;
  wishCount?: number;
  isWished?: boolean;
}
