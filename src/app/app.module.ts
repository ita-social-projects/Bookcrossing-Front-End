import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { LoginComponent } from './shared/components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './shared/components/registration/registration.component';
import { BookService } from './core/services/book/book.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { BookComponent } from './shared/components/book/book.component';
import { RequestsComponent } from './shared/components/requests/requests.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { BooksComponent } from './shared/components/books/books.component';
import { AddBookComponent } from './shared/components/add-book/add-book.component';
import { AuthorsComponent } from './shared/components/authors/authors.component';
import { AuthorFormComponent } from './shared/components/author-form/author-form.component';
import { ReportsComponent } from './shared/components/reports/reports.component';
import { FilterPipe } from './shared/pipes/filter.pipe';
import { RefDirective } from './shared/directives/ref.derictive';

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
    AuthorsComponent,
    AuthorFormComponent,
    ReportsComponent,
    FilterPipe,
    RefDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatSelectModule
  ],
  providers: [
    BookService
  ],  
  entryComponents: [AuthorFormComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }