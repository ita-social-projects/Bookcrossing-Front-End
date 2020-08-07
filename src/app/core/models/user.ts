import { IRoomLocation } from './roomLocation';

export interface IUser {
  id: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  isEmailAllowed: boolean;
  userLocation?: IRoomLocation;
  birthDate: Date;
  registeredDate: Date;
}
