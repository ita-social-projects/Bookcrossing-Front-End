import { Input } from '@angular/core'
import { IOuterAuthor} from './outerAuthor';

export interface IOuterBook{
    id:number;
    title: string;
    imageUrl:string;
    authors:IOuterAuthor[];
    author:IOuterAuthor;
    publisher:string;
    languageCode:string;
    description:string;
    }