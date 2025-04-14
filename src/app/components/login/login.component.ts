import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
  username = '';
  password = '';


  constructor(private authService: AuthService, private router: Router) {}

login() {
  if (!this.username || !this.password) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  const loginData = {
    username: this.username,
    password: this.password,
  };

  this.authService.login({ 
    username: this.username, 
    password: this.password 
  }).subscribe({
    next: (res) => {
      const { token, user } = res;
      this.authService.saveToken(token, user.id, user.isAdmin.toString());
      this.router.navigate(['']);
    }
  });
  
  
}

}  

  

