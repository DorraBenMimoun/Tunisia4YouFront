import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false; 


  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit() {
 this.authService.getIsLoggedIn().subscribe((loggedInStatus) => {
  this.isLoggedIn = loggedInStatus;
    // only update isAdmin if user is logged in
    if (this.isLoggedIn) {
      this.isAdmin = this.authService.isAdmin();
    } else {
      this.isAdmin = false; // <- prevent leftover value
    }
  });


  }

  logout() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

}
