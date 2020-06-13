import {IRoomLocation} from './roomLocation';

export interface IUserPut {
  id: number;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email: string;
  password: string;
  roleId: number;
  birthDate: Date;
  registeredDate: Date;
  userLocation?: IRoomLocation;
  fieldMasks?: string[];
}

