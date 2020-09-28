import { IRoomLocation } from './roomLocation';
import {ILocationHome} from './locationHome';

export interface IUser {
  id: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  isEmailAllowed: boolean;
  userLocation?: IRoomLocation;
  locationHome?: ILocationHome;
  birthDate: Date;
  registeredDate: Date;
}
