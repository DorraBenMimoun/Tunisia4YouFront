import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  photo: string = ''; 
  isAdmin: boolean = false; 

  constructor(private authService: AuthService) {}

  register() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      alert('Tous les champs sont obligatoires.');
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    const userData = {
      username: this.username,
      email: this.email,
      passwordHash: this.password,
      photo: this.photo || 'default.jpg', // Valeur par défaut si aucune photo n'est fournie
      isAdmin: this.isAdmin
    };
    this.authService.register(userData).subscribe({
      next: () => {
        alert('Inscription réussie !');
      },
      error: (err) => {
        alert('Erreur : ' + (err.error?.message || 'Une erreur est survenue.'));
      }
    });
  }
}

