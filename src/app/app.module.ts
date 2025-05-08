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

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ExploreComponent } from './components/explore/explore.component';
import { PlaceDetailsComponent } from './components/place-details/place-details.component';
import { UserListsComponent } from './components/user-lists/user-lists.component';
import { CreateListComponent } from './components/create-list/create-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AddToListsComponent } from './components/add-to-lists/add-to-lists.component';
import { ViewListComponent } from './components/view-list/view-list.component';
import { ReviewComponent } from './components/review/review.component';
import { ReportComponent } from './admin/report/report.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';



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
    ExploreComponent,
    PlaceDetailsComponent,
    UserListsComponent,
    CreateListComponent,
    AddToListsComponent,
    ViewListComponent,
    ReviewComponent,
    ReportComponent,
    SafeUrlPipe,
    AdminNavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ToastrModule.forRoot({
      timeOut: 3000, // 5 secondes
      positionClass: 'toast-bottom-right', // position
      preventDuplicates: true,
      progressBar: true,
    })
        ],
    providers: [
      provideHttpClient(withInterceptors([authInterceptor])),
      provideAnimationsAsync()
      ],
    
  bootstrap: [AppComponent]
})
export class AppModule { }
