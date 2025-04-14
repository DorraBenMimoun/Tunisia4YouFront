import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
  //photo: string = ''; 
  //isAdmin: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}
  register() {
    console.log("Bouton inscription cliqué"); // 👈 Ajout du log
  
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
      passwordHash: this.password
    };
  
    console.log("Données envoyées à register:", userData); // 👈 Ajout du log
  
    this.authService.register(userData).subscribe({
      next: () => {
        alert('Inscription réussie !');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur complète :', err); // 👈 Ajout du log
        alert('Erreur : ' + (err.error?.message || 'Une erreur est survenue.'));
      }
    });
  }
  
}

