import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './shared/components/login/login.component';
import {RegistrationComponent} from './shared/components/registration/registration.component';
import { BooksComponent } from './shared/components/books/books.component';

const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path :'books',component:BooksComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
