import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {
isLoggedIn: boolean = false;
  isAdmin: boolean = false; 
  isLoggedInSubscription !: Subscription;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit() {
    this.isLoggedInSubscription = this.authService.isLoggedInSubject.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
  
      if (isLoggedIn) {
        const id = this.authService.getUserId();
        if (id) {
          this.authService.getUserById(id).subscribe((user) => {
            this.authService.setUser(user);
            this.isAdmin = user.isAdmin;
          });
        }
      } else {
        this.isAdmin = false;
      }
    });
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isAdmin = false; 
    this.isLoggedIn = false; 
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
  }
}
