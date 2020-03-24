import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './shared/components/login/login.component';
import {RegistrationComponent} from './shared/components/registration/registration.component';
import { BookComponent } from './shared/components/book/book.component';
import { RequestsComponent } from './shared/components/requests/requests.component';

const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  // { path: 'admin', children:
  //   [
  //     { path: '', component: AdminDashboardComponent },
  //   ]
  // },
  {path: 'book', component: BookComponent},
  {path: 'requests/:id', component: RequestsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
