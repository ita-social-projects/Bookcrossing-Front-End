import { NotifyAction } from './notifyAction.enum';

export interface INotification {
  id: number;
  message: string;
  bookId?: number;
  action: NotifyAction;
  isSeen: boolean;
  date: Date;
}
