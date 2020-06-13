import {IRoomLocation} from './roomLocation';
import { IRole } from './role';
import { Role } from './role.enum';
import {Token} from "@angular/compiler";
import {IToken} from "./token";

export interface IUser {
  id: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  role: IRole;
  userLocation: IRoomLocation;
  birthDate: Date;
  registeredDate: Date;
  token: IToken;
}
