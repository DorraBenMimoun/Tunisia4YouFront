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

const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent } ,
  { path: 'signup', component: SignupComponent } ,
  { path: 'tags', component: TagsComponent },
  { path: '', redirectTo: '/admin/tags', pathMatch: 'full' },
  { path: 'admin', component: DashboardComponent },
  { path: 'places', component: PlaceComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'reset', component: ResetPassComponent },
  { path: 'forget', component: ForgetPassComponent },


   



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
