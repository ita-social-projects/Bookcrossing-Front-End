import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './shared/components/login/login.component';
import {RegistrationComponent} from './shared/components/registration/registration.component';
import {BookComponent} from './shared/components/book/book.component';
import {RequestsComponent} from './shared/components/requests/requests.component';
import {BooksComponent} from './shared/components/books/books.component';
import {AuthorsComponent} from './shared/components/authors/authors.component';
import {AddBookComponent} from './shared/components/add-book/add-book.component';
import { DemoComponent } from './shared/components/demo/demo.component';
import {AdminComponent} from './shared/components/admin/admin.component';
import { AddLocationComponent } from './shared/components/add-location/add-location.component';
import { MapboxComponent } from './shared/components/mapbox/mapbox.component';
import { ForgotPasswordComponent } from './shared/components/password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/components/password/reset-password/reset-password.component';
import {HomeComponent} from './shared/components/home/home.component';
import {RulesComponent} from './shared/components/rules/rules.component';
import {GenreComponent} from './shared/components/genre/genre.component';
import {RegisteredBookComponent} from './shared/components/registered-book/registered-book.component';



// @ts-ignore
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

  {path: 'admin',component:AdminComponent,children:
  [
    {path: 'authors', component: AuthorsComponent}
  ]
  },

  {path: 'book/:id', component: BookComponent},
  {path: 'book', component: AddBookComponent},
  {path: 'requests', component: RequestsComponent},
  {path: 'books', component: BooksComponent},
  {path: 'add-location', component: AddLocationComponent },
  {path: '', component: HomeComponent},
  {path: 'rules', component: RulesComponent},
  {path: 'demo', component: DemoComponent},
  {path: 'genres', component: GenreComponent},
  {path: 'books/registered', component: RegisteredBookComponent},
  { path: 'password', children:
    [
      { path: 'forgot', component: ForgotPasswordComponent },
      { path: 'reset', component: ResetPasswordComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
