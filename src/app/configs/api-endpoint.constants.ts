
import { environment } from 'src/environments/environment';

export const baseUrl = environment.apiUrl + "/api/";
export const assetsUrl = environment.apiUrl + "/assets/";
export const requestUrl = baseUrl + "requests";
export const bookUrl = baseUrl + "books/";
export const authorUrl = baseUrl + "authors";
export const locationUrl = baseUrl + 'location';
export const loginUrl = baseUrl + 'login';
export const userUrl = baseUrl + 'users';

