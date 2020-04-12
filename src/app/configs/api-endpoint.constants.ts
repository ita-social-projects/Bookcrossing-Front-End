import { environment } from 'src/environments/environment';

export const baseUrl = environment.apiUrl + "/api/";
export const requestUrl = baseUrl + "requests";
export const bookUrl = baseUrl + "books";
export const authorUrl = baseUrl + "authors";
export const locationUrl = baseUrl + 'location';
