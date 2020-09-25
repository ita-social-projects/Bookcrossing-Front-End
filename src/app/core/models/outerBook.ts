import { IOuterAuthor} from './outerAuthor';

export interface IOuterBook {
    id: number;
    title: string;
    imageUrl: string;
    authors: IOuterAuthor[];
    author: IOuterAuthor;
    publisher: string;
    isbn: string;
    languageCode: string;
    description: string;
    }
