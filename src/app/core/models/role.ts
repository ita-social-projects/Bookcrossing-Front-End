import { IUser } from './user';

export interface IRole {
    id : number;
    name : string;
    user: IUser[];
}
