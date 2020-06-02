import {AuthGuard} from './core/guards/auth.guard';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './shared/components/login/login.component';
import {RegistrationComponent} from './shared/components/registration/registration.component';
import {BookComponent} from './shared/components/book/book.component';
import {RequestsComponent} from './shared/components/requests/requests.component';
import {BooksComponent} from './shared/components/books/books.component';
import {AuthorsComponent} from './shared/components/admin/authors/authors.component';
import {AddBookComponent} from './shared/components/add-book/add-book.component';
import {DemoComponent} from './shared/components/demo/demo.component';
import {AdminComponent} from './shared/components/admin/admin.component';
import { LocationFormComponent } from './shared/components/admin/location-form/location-form.component';
import { ForgotPasswordComponent } from './shared/components/password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/components/password/reset-password/reset-password.component';
import {HomeComponent} from './shared/components/home/home.component';
import {RulesComponent} from './shared/components/rules/rules.component';
import {RegisteredBookComponent} from './shared/components/registered-book/registered-book.component';
import {CurrentOwnedBooksComponent} from './shared/components/current-owned-books/current-owned-books.component';
import {CommentComponent} from './shared/components/comment/comment.component';
import {ChildcommentComponent} from './shared/components/comment/childcomment/childcomment.component';
import {ReadBooksComponent} from './shared/components/read-books/read-books.component';
import {NgContentAst} from "@angular/compiler";
import {ContactsComponent} from './shared/components/contacts/contacts.component';
import {LocationsComponent} from './shared/components/admin/locations/locations.component';
import {GenresComponent} from './shared/components/admin/genres/genres.component';
import {DashboardComponent} from './shared/components/admin/dashboard/dashboard.component';
import {ProfileComponent} from './shared/components/profile/profile.component';
import {AuthorFormComponent} from './shared/components/admin/author-form/author-form.component';
import {Role} from './core/models/role.enum';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';


// @ts-ignore
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},

  {path: 'admin', component: AdminComponent,
    canActivate: [AuthGuard],
    data: {roles: Role.Admin},
    children:
      [
        {path: 'dashboard', component: DashboardComponent},
        {path: 'authors', component: AuthorsComponent},
        {path: 'locations', component: LocationsComponent},
        {path: 'genres', component: GenresComponent},
        {path: 'location-form', component: LocationFormComponent},
        {path: 'author-form', component: AuthorFormComponent}
      ]
  },

  {path: 'book/:id', component: BookComponent},
  {path: 'book', component: AddBookComponent},
  {path: 'books/requests', component: RequestsComponent, canActivate: [AuthGuard]},
  {path: 'books', component: BooksComponent},
  {path: 'location-form', component: LocationFormComponent },
  {path: '', component: HomeComponent},
  {path: 'rules', component: RulesComponent},
  {path: 'demo', component: DemoComponent},
  {path: 'books/registered', component: RegisteredBookComponent},
  {path: 'books/current', component: CurrentOwnedBooksComponent},
  {
    path: 'comment', component: CommentComponent, children: [

      {path: 'subcomment', component: ChildcommentComponent}
    ]
  },
  {path: 'books/read', component: ReadBooksComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: 'profile', component: ProfileComponent},
  { path: 'password', children:
      [
        {path: 'forgot', component: ForgotPasswordComponent},
        {path: 'reset', component: ResetPasswordComponent},
      ]
  },
  {
    path: "**",
    component: NotFoundComponent,
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule {
}
