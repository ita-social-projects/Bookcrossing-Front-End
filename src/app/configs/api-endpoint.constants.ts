import { environment } from "src/environments/environment";

export const baseUrl = environment.apiUrl + "/api/";
export const requestUrl = baseUrl + "requests";
export const bookUrl = baseUrl + "books";
