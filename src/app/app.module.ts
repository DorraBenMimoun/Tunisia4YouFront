import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TagsComponent } from './components/admin/tags/tags.component';
import { PlaceComponent } from './components/admin/place/place.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';
import { ForgetPassComponent } from './components/forget-pass/forget-pass.component';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    ProfileComponent,
    TagsComponent,
    PlaceComponent,
    ResetPassComponent,
    ForgetPassComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ],
    providers: [
      provideHttpClient(withInterceptors([authInterceptor]))
      ],
    
  bootstrap: [AppComponent]
})
export class AppModule { }
