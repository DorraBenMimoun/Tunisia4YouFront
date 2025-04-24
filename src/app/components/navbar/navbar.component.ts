import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
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
