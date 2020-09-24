import { MessageStatus } from './messageStatus.enum';


export interface ISuggestionMessage {
    id?: number;
    userId?: number;
    userFirstName?: string;
    userLastName?: string;
    userEmail?: string;
    isChecked?: boolean;
    summary?: string;
    text?: string;
    state?: MessageStatus;
}