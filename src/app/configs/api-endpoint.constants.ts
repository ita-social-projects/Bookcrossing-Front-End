
import { environment } from 'src/environments/environment';

export const baseUrl = environment.apiUrl + '/api/';
export const assetsUrl = environment.apiUrl + '/assets/';
export const requestUrl = baseUrl + 'requests';
export const bookUrl = baseUrl + 'books/';
export const authorUrl = baseUrl + 'authors';
export const locationUrl = baseUrl + 'locations/';
export const locationHomeUrl = baseUrl + 'locationHome/';
export const loginUrl = baseUrl + 'login';
export const userUrl = baseUrl + 'users';
export const genreUrl = baseUrl + 'genre/';
export const commentRootUrl = baseUrl + 'bookrootcomments/';
export const commentChildUrl = baseUrl + 'bookchildcomments/';
export const refreshTokenUrl = loginUrl + '/refresh';
export const dashboardUrl = baseUrl + 'admin/dashboard';
export const languageUrl = baseUrl + 'language/';
export const outerBookUrl = baseUrl + 'OuterBooksSource/';
export const wishListUrl = baseUrl + 'WishList/';
export const aphorismUrl = baseUrl + 'Aphorism';
export const registrationUrl = window.location.origin + '/registration/';
export const bookRegistrationUrl = window.location.origin + '/book/';
export const booksUrl = window.location.origin + '/books/';
export const notificationUrl = baseUrl + 'notifications/';
export const statisticsUrl = baseUrl + 'statistics';
export const messagesUrl = baseUrl + 'messages';
export const issueUrl = baseUrl + 'issue/';
export const suggestionMessageUrl = baseUrl + 'suggestionmessage/';
