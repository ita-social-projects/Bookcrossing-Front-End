import { IUserInfo } from './userInfo';

export interface IRole {
    id : number;
    name : string;
    user: IUserInfo[];
}
