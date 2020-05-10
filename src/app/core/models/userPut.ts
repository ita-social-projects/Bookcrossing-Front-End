import {IRoomLocation} from './roomLocation';
import { IRole } from './role';

export interface IUserPut {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  roleId: number;
  fieldMasks?: string[];
}
