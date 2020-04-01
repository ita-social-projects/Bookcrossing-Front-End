import { IAuthor } from "./author";
import { IGenre } from "./genre";
export interface IBook {
  id?: number;
  name: string;
  userId: number;
  publisher?: string;
  available: boolean;
  authors: IAuthor[];
  genres: IGenre[];
}
