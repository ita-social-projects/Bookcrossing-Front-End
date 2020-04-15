import { assetsUrl } from './configs/api-endpoint.constants';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { LoginComponent } from './shared/components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './shared/components/registration/registration.component';
import { BookService } from './core/services/book/book.service';
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CookieService } from "ngx-cookie-service";
import { BookComponent } from './shared/components/book/book.component';
import { RequestsComponent } from './shared/components/requests/requests.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { JwtModule } from "@auth0/angular-jwt";
import { BooksComponent } from './shared/components/books/books.component';
import { AddBookComponent } from './shared/components/add-book/add-book.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { MatCardModule } from '@angular/material/card';
import { LanguageService } from './core/services/language/language.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddLocationComponent } from './shared/components/add-location/add-location.component';
import { LocationService } from './core/services/location/location.service';
import { NotificationService } from './core/services/notification/notification.service';
import { MapboxComponent } from './shared/components/mapbox/mapbox.component';
import { MatInputModule } from '@angular/material/input';
import { AuthorsComponent } from './shared/components/authors/authors.component';
import { AuthorFormComponent } from './shared/components/author-form/author-form.component';
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
import { MatButtonModule  } from '@angular/material/button';
import { ViewLocationComponent } from './shared/components/view-location/view-location.component';
import { ContentFilterPipe } from './shared/pipes/content-filter.pipe';

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
    AddLocationComponent,
    MapboxComponent,
    AuthorsComponent,
    AuthorFormComponent,
    ReportsComponent,
    FilterPipe,
    RefDirective,
    PaginationComponent,
    DemoComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminComponent,
    DemoComponent,
    ViewLocationComponent,
    ContentFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    MatMenuModule,
    JwtModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatSelectModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [""],
        blacklistedRoutes: [""]
      }
    }),
  ],
  providers: [
    BookService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    LanguageService,
    NotificationService,
    CookieService,
    JwtHelperService,
    LocationService

  ],
  entryComponents: [AuthorFormComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http , assetsUrl + 'i18n/', '.json');
}
export function tokenGetter() {
  return localStorage.getItem("currentUser");
}
