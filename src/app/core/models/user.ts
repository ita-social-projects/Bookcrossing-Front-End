import { IRoomLocation } from './roomLocation';
import { IHomeAdress } from './homeAdress';

export interface IUser {
  id: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  isEmailAllowed: boolean;
  userRoomLocation?: IRoomLocation;
  userHomeAdress?: IHomeAdress;
  birthDate: Date;
  registeredDate: Date;
}