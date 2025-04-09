import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { TagsComponent } from './components/admin/tags/tags.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { PlaceComponent } from './components/admin/place/place.component';

const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent } ,
  { path: 'signup', component: SignupComponent } ,
  { path: 'tags', component: TagsComponent },
  { path: '', redirectTo: '/admin/tags', pathMatch: 'full' },
  { path: 'admin', component: DashboardComponent },
  { path: 'places', component: PlaceComponent },
   



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
