import { AuthGuard } from './core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { RegistrationComponent } from './shared/components/registration/registration.component';
import { BookComponent } from './shared/components/book/book.component';
import { CurrentlyOwnedBooksComponent } from './shared/components/books/currently-owned-books.component';
import { RegisteredBooksComponent } from './shared/components/books/registered-books.component';
import { ReadBooksComponent } from './shared/components/books/read-books.component';
import { RequestsComponent } from './shared/components/requests/requests.component';
import { BooksComponent } from './shared/components/books/books.component';
import { AuthorsComponent } from './shared/components/admin/authors/authors.component';
import { AddBookComponent } from './shared/components/add-book/add-book.component';
import { DemoComponent } from './shared/components/demo/demo.component';
import { AdminComponent } from './shared/components/admin/admin.component';
import { LocationFormComponent } from './shared/components/admin/location-form/location-form.component';
import { ForgotPasswordComponent } from './shared/components/password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/components/password/reset-password/reset-password.component';
import { HomeComponent } from './shared/components/home/home.component';
import { RulesComponent } from './shared/components/rules/rules.component';
import { CommentComponent } from './shared/components/comment/comment.component';
import { ChildcommentComponent } from './shared/components/comment/childcomment/childcomment.component';
import { NgContentAst } from '@angular/compiler';
import { ContactsComponent } from './shared/components/contacts/contacts.component';
import { LocationsComponent } from './shared/components/admin/locations/locations.component';
import { SuggestionMessageComponent } from './shared/components/admin/suggestion-message/suggestion-message/suggestion-message.component'
import { GenresComponent } from './shared/components/admin/genres/genres.component';
import { DashboardComponent } from './shared/components/admin/dashboard/dashboard.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { AuthorFormComponent } from './shared/components/admin/author-form/author-form.component';
import { Role } from './core/models/role.enum';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LocationGuard } from './core/guards/location.guard';
import { BookLanguagesComponent } from './shared/components/admin/languages/languages.component';
import { LanguageFormComponent } from './shared/components/admin/language-form/language-form.component';
import { FoundBooksComponent } from './shared/components/found-books/found-books.component';
import { ForbidEmailComponent } from './shared/components/email-notification-forbid/email-notification-forbid.component';
import { WishListComponent } from './shared/components/wish-list/wish-list.component';
import { UsersComponent } from './shared/components/admin/users/users.component';
import { BookCanDeactivateGuard } from './core/guards/bookCanDeactivate.guard';
import { BasicAuthOnlyGuard } from './core/guards/basicAuthOnly.guard';
import { UserViewComponent } from './shared/components/admin/user-view/user-view.component';
import {StatisticsComponent} from './shared/components/statistics/statistics.component';


// @ts-ignore
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [BasicAuthOnlyGuard],
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [BasicAuthOnlyGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: Role.Admin },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'authors', component: AuthorsComponent },
      { path: 'locations', component: LocationsComponent },
      { path: 'genres', component: GenresComponent },
      { path: 'location-form', component: LocationFormComponent },
      { path: 'author-form', component: AuthorFormComponent },
      { path: 'languages', component: BookLanguagesComponent },
      { path: 'language-form', component: LanguageFormComponent },
      { path: 'users', component: UsersComponent },
      { path: 'user/:id', component: UserViewComponent },
      { path: 'suggestion-message', component: SuggestionMessageComponent }
    ],
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'book/:id',
    component: BookComponent,
    canDeactivate: [BookCanDeactivateGuard],
  },
  {
    path: 'book',
    component: AddBookComponent,
    canActivate: [AuthGuard, LocationGuard],
  },
  { path: 'found-books', component: FoundBooksComponent },
  {
    path: 'books/requests',
    component: RequestsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'books/read',
    component: ReadBooksComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'books/registered',
    component: RegisteredBooksComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'books/current',
    component: CurrentlyOwnedBooksComponent,
    canActivate: [AuthGuard],
  },
  { path: 'books', component: BooksComponent },
  { path: 'location-form', component: LocationFormComponent },
  { path: 'wishlist', component: WishListComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent },
  { path: 'email', component: ForbidEmailComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'demo', component: DemoComponent },
  {
    path: 'comment',
    component: CommentComponent,
    children: [{ path: 'subcomment', component: ChildcommentComponent }],
  },
  { path: 'contacts', component: ContactsComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'password',
    children: [
      { path: 'forgot', component: ForgotPasswordComponent },
      { path: 'reset', component: ResetPasswordComponent },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
