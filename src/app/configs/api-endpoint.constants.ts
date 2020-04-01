import { environment } from "src/environments/environment";

export const baseUrl = environment.apiUrl;
export const requestUrl = baseUrl + "requests";
export const bookUrl = baseUrl + "books";
