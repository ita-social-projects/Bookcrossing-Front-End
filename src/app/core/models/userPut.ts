import { IUser } from './user';

export interface IUserPut extends IUser {
  password: string;
  roleId: number;
  fieldMasks?: string[];
}

