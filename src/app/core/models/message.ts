// export interface IMessage {
//     userId: number;
//     message: string;
// }

import { IUserInfo } from './userInfo';

export interface IMessage {
    id?: number;
    user?: IUserInfo;
    summary?: string;
    text?: string;
    status?: boolean;
}