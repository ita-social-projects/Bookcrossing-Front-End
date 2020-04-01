import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { LoginComponent } from './shared/components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegistrationComponent } from './shared/components/registration/registration.component';
import { Routes, RouterModule } from '@angular/router';
import { BookService } from './core/services/book.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import { BookComponent } from './shared/components/book/book.component';
import { RequestsComponent } from './shared/components/requests/requests.component';
import { RequestService } from './core/services/request/request.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { BooksComponent } from './shared/components/books/books.component';
import { AddBookComponent } from './shared/components/add-book/add-book.component';
import { BooksService } from './core/services/books.service';

const appRoutes: Routes = [
  { path: "", component: RegistrationComponent},
  { path: "login", component: LoginComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "book", component: AddBookComponent}
];

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
    BooksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatSelectModule
  ],
  providers: [
    BooksService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }