// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiUrl: 'https://bookcrossingbackend-dev-as.azurewebsites.net',
  apiUrl: 'https://localhost:44370',
  mapbox: {
    accessToken: 'pk.eyJ1IjoicGVubnkxMjM0IiwiYSI6ImNrOG9scGNjMzB6Zngzb28yejQ3bm9kMjQifQ.t5SaCnw0vo7PClJDIgbb5w'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
