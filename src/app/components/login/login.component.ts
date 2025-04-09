import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService) {}

  login() {
    if (!this.username || !this.password) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    const loginData = {
      username: this.username,
      passwordHash: this.password,
      email: '', // Valeur par défaut
      photo: '', // Valeur par défaut
      isAdmin: false // Valeur par défaut
    };
  
    this.authService.login(loginData).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        alert('Connexion réussie !');
      },
      error: (err) => {
        alert('Erreur : ' + (err.error?.message || 'Identifiants invalides.'));
      }
    });
  }
}

  

