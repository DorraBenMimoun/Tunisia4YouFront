import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  register() {
    console.log("Bouton inscription cliqué");

    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.toastr.warning('Tous les champs sont obligatoires.', 'Attention');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.warning('Les mots de passe ne correspondent pas.', 'Attention');
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      passwordHash: this.password
    };

    console.log("Données envoyées à register:", userData);

    this.authService.register(userData).subscribe({
      next: () => {
        this.toastr.success('Inscription réussie !', 'Succès');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur complète :', err);
        const msg = err.error?.message || 'Une erreur est survenue.';
        this.toastr.error(msg, 'Erreur');
      }
    });
  }
}
