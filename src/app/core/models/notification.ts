import { NotifyAction } from './notifyAction.enum';

export interface INotification {
  id: number;
  message: string;
  bookId?: number;
  receiverUserId?: number;
  action: NotifyAction;
  isSeen: boolean;
  date: Date;
}
