export interface ISuggestionMessage {
    id?: number;
    userId?: number;
    userFirstName?: string;
    userLastName?: string;
    userEmail?: string;
    summary?: string;
    text?: string;
    status?: boolean;
}