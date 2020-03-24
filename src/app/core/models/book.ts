import { author } from './author';
import {genre} from './genre';
export class book{
    id:number;
    name:string;
    userId:number;
    publisher:string;
    available:boolean;
    authors:author[];
    genres:genre[];


}