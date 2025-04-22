import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { TagsComponent } from './components/admin/tags/tags.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { PlaceComponent } from './components/admin/place/place.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';
import { ForgetPassComponent } from './components/forget-pass/forget-pass.component';
import { ExploreComponent } from './components/explore/explore.component';
import { PlaceDetailsComponent } from './components/place-details/place-details.component';
import { UserListsComponent } from './components/user-lists/user-lists.component';
import { ViewListComponent } from './components/view-list/view-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'explore', component:ExploreComponent},
  { path: 'reset', component: ResetPassComponent },
  { path: 'forget', component: ForgetPassComponent },
  { path: 'place/:id', component: PlaceDetailsComponent },
  { path: 'lists', component: UserListsComponent},
  { path:'list/:id', component: ViewListComponent},
  // 🔥 Supprime ces routes déplacées vers AdminModule
  //{ path: 'tags', component: TagsComponent },
  //{ path: 'places', component: PlaceComponent },

  // ✅ Lazy loading vers le module admin
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },

  // ✅ Redirection par défaut si rien n'est trouvé
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
