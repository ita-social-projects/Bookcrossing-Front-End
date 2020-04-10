import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './shared/components/login/login.component';
import {RegistrationComponent} from './shared/components/registration/registration.component';
import { BookComponent } from './shared/components/book/book.component';
import { RequestsComponent } from './shared/components/requests/requests.component';
import { BooksComponent } from './shared/components/books/books.component';
import { AuthorsComponent } from './shared/components/authors/authors.component';
import { AddBookComponent } from './shared/components/add-book/add-book.component';

const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  // { path: 'admin', children:
  //   [
  //     { path: '', component: AdminDashboardComponent },
  //   ]
  // },
  {path: 'book/:id', component: BookComponent},
  {path: "book", component: AddBookComponent},
  {path: 'requests/:id', component: RequestsComponent},
  {path :'books',component:BooksComponent},
  {path: 'authors',component:AuthorsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
