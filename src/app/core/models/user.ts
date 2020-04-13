import {Role} from './role';
import {IRoomLocation} from './roomLocation';

export interface IUser {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  Role: Role;
  userLocacion: IRoomLocation;
  token?: string;
}
