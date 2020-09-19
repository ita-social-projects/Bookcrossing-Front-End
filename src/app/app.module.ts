import { BookEditFormComponent } from './shared/components/book-edit-form/book-edit-form.component';
import { UserService } from './core/services/user/user.service';
import { RequestService } from 'src/app/core/services/request/request.service';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from './shared/components/message-dialog/message-dialog.component';
import { assetsUrl } from './configs/api-endpoint.constants';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { LoginComponent } from './shared/components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './shared/components/registration/registration.component';
import { BookService } from './core/services/book/book.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { BookComponent } from './shared/components/book/book.component';
import { CurrentlyOwnedBooksComponent } from './shared/components/books/currently-owned-books.component';
import { RegisteredBooksComponent } from './shared/components/books/registered-books.component';
import { ReadBooksComponent } from './shared/components/books/read-books.component';
import { RequestsComponent } from './shared/components/requests/requests.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { JwtModule } from '@auth0/angular-jwt';
import { BooksComponent } from './shared/components/books/books.component';
import { AddBookComponent } from './shared/components/add-book/add-book.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { MatCardModule } from '@angular/material/card';
import { LanguageService } from './core/services/language/language.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LocationFormComponent } from './shared/components/admin/location-form/location-form.component';
import { LocationService } from './core/services/location/location.service';
import { NotificationService } from './core/services/notification/notification.service';
import { MapboxComponent } from './shared/components/mapbox/mapbox.component';
import { MatInputModule } from '@angular/material/input';
import { AuthorsComponent } from './shared/components/admin/authors/authors.component';
import { AuthorFormComponent } from './shared/components/admin/author-form/author-form.component';
import { ReportsComponent } from './shared/components/reports/reports.component';
import { DemoComponent } from './shared/components/demo/demo.component';
import { ForgotPasswordComponent } from './shared/components/password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/components/password/reset-password/reset-password.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterPipe } from './shared/pipes/filter.pipe';
import { RefDirective } from './shared/directives/ref.derictive';
import { AdminComponent } from './shared/components/admin/admin.component';
import { JwtInterceptor } from './shared/validators/jwt.interceptor';
import { ErrorInterceptor } from './shared/validators/error.interceptor';
import { MatButtonModule } from '@angular/material/button';
import { ViewLocationComponent } from './shared/components/view-location/view-location.component';
import { ContentFilterPipe } from './shared/pipes/content-filter.pipe';
import { GenreService } from './core/services/genre/genre';
import { HomeComponent } from './shared/components/home/home.component';
import { RulesComponent } from './shared/components/rules/rules.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DialogService } from './core/services/dialog/dialog.service';
import { LanguagesComponent } from './shared/components/languages/languages.component';
import { AvatarModule } from 'ngx-avatar';
import { SearchBarComponent } from './shared/components/search-bar/search-bar.component';
import { ProfileAvatarComponent } from './shared/components/profile-avatar/profile-avatar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BookFilterBarComponent } from './shared/components/book-filter-bar/book-filter-bar.component';
import { CommentComponent } from './shared/components/comment/comment.component';
import { ChildcommentComponent } from './shared/components/comment/childcomment/childcomment.component';
import { AdminTableComponent } from './shared/components/admin/admin-table/admin-table.component';
import { GenresComponent } from './shared/components/admin/genres/genres.component';
import { LocationsComponent } from './shared/components/admin/locations/locations.component';
import { GenreFormComponent } from './shared/components/admin/genre-form/genre-form.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ContactsComponent } from './shared/components/contacts/contacts.component';
import { DashboardComponent } from './shared/components/admin/dashboard/dashboard.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { ProfileEditComponent } from './shared/components/profile-edit/profile-edit.component';
import { DonateDialogComponent } from './shared/components/donate-dialog/donate-dialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EllipsisPipe } from './shared/pipes/elipsis.pipe';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { MatLineModule, MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { UserNamePipe } from './shared/pipes/userName.pipe';
import { StarRatingModule } from '@sreyaj/ng-star-rating';
import { BreadcrumbValuePipe } from './shared/pipes/breadcrumbValue.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { DefaultImageDirective } from './shared/directives/defaultImage.derective';
import { LocationPopupComponent } from './shared/components/location-popup/location-popup.component';
import { BookLanguageService } from './core/services/bookLanguage/bookLanguage.service';
import { BookLanguagesComponent } from './shared/components/admin/languages/languages.component';
import { LanguageFormComponent } from './shared/components/admin/language-form/language-form.component';
import { RegistrationService } from './core/services/registration/registration.service';
import { ForbidEmailComponent } from './shared/components/email-notification-forbid/email-notification-forbid.component';
import { EmailNotificationService } from './core/services/emailnotification/emailnotification.service';
import { InputTrimModule } from 'ng2-trim-directive';
import { FoundBooksComponent } from './shared/components/found-books/found-books.component';
import { WishListComponent } from './shared/components/wish-list/wish-list.component';
import { WishListService } from './core/services/wishlist/wishlist.service';
import { UsersComponent } from './shared/components/admin/users/users.component';
import { NotificationBellComponent } from './shared/components/notification-bell/notification-bell.component';
import { NotificationBellService } from './core/services/notification-bell/notification-bell.service';
import { SignalRService } from './core/services/signal-r/signalr.service';
import { BookCanDeactivateGuard } from './core/guards/bookCanDeactivate.guard';
import { Configuration } from 'msal';
import { AppConfig } from './configs/app.config';
import { BroadcastService, MSAL_CONFIG, MSAL_CONFIG_ANGULAR, MsalAngularConfiguration, MsalModule, MsalService } from '@azure/msal-angular';
import { UserViewComponent } from './shared/components/admin/user-view/user-view.component';
import { StatisticsComponent } from './shared/components/statistics/statistics.component';
import { StatisticsService } from './core/services/statistics/statistics.service';
import { MatSelectFilterModule } from 'mat-select-filter';
import { IssuesComponent } from './shared/components/admin/issues/issues/issues.component';
import { RequestFromCompanyComponent } from './shared/components/request-from-company/request-from-company.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    AddBookComponent,
    BookComponent,
    RequestsComponent,
    NavbarComponent,
    FooterComponent,
    BooksComponent,
    RegisteredBooksComponent,
    CurrentlyOwnedBooksComponent,
    ReadBooksComponent,
    LocationFormComponent,
    MapboxComponent,
    AuthorsComponent,
    AuthorFormComponent,
    BookFilterBarComponent,
    ReportsComponent,
    FilterPipe,
    EllipsisPipe,
    UserNamePipe,
    RefDirective,
    PaginationComponent,
    DemoComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminComponent,
    DemoComponent,
    BookEditFormComponent,
    ViewLocationComponent,
    ContentFilterPipe,
    HomeComponent,
    RulesComponent,
    ConfirmDialogComponent,
    LanguagesComponent,
    SearchBarComponent,
    MessageDialogComponent,
    ProfileAvatarComponent,
    BookFilterBarComponent,
    CommentComponent,
    ChildcommentComponent,
    ContactsComponent,
    AdminTableComponent,
    GenresComponent,
    LocationsComponent,
    GenreFormComponent,
    ContactsComponent,
    NotFoundComponent,
    DashboardComponent,
    ProfileComponent,
    ProfileEditComponent,
    DonateDialogComponent,
    NotificationComponent,
    BreadcrumbValuePipe,
    DefaultImageDirective,
    LocationPopupComponent,
    BookLanguagesComponent,
    LanguageFormComponent,
    FoundBooksComponent,
    ForbidEmailComponent,
    WishListComponent,
    UsersComponent,
    NotificationBellComponent,
    UserViewComponent,
    StatisticsComponent,
    IssuesComponent,
    RequestFromCompanyComponent,
  ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    InputTrimModule,
    MatSelectFilterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTooltipModule,
    JwtModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatSidenavModule,
    NgxPaginationModule,
    AvatarModule,
    StarRatingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatSelectModule,
    MatAutocompleteModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: [''],
        blacklistedRoutes: [''],
      },
    }),
    MatLineModule,
    MatListModule
  ],
  providers: [
    BookService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    RequestService,
    LanguageService,
    RegistrationService,
    NotificationService,
    CookieService,
    JwtHelperService,
    LocationService,
    GenreService,
    DialogService,
    UserService,
    DatePipe,
    BookLanguageService,
    EmailNotificationService,
    WishListService,
    NotificationBellService,
    SignalRService,
    BookCanDeactivateGuard,
    WishListService,
    MsalService,
    BroadcastService,
    {
      provide: MSAL_CONFIG,
      useFactory: MSALConfigFactory
    },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory
    },
    StatisticsService,
  ],
  entryComponents: [AuthorFormComponent, LocationPopupComponent],
  bootstrap: [AppComponent],
})

export class AppModule {}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, assetsUrl + 'i18n/', '.json');
}

export function tokenGetter() {
  return localStorage.getItem('currentUser');
}

function MSALConfigFactory(): Configuration {
  return {
    auth: {
      clientId: AppConfig.activeDirectoryConfig.clientId,
      authority: AppConfig.activeDirectoryConfig.authority,
      validateAuthority: true,
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: true,
    }
  };
}

function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return {
    popUp: false
  };
}
