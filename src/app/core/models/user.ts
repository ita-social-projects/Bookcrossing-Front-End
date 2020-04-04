import { IRole } from './role';
import { IRoomLocation } from './roomLocation';

export interface IUser {
    id : number;
    firstName : string;
    middleName : string;
    lastName : string;
    email : string;
    Role : IRole;
    userLocacion : IRoomLocation;
}