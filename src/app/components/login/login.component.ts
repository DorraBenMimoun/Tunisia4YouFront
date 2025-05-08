import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.toastr.warning('Veuillez remplir tous les champs.');
      return;
    }

    this.authService.login({ 
      username: this.username, 
      password: this.password 
    }).subscribe({
      next: (res) => {
        const { token, user } = res;
        this.authService.saveToken(token, user.id, user.isAdmin.toString());
        this.toastr.success('Connexion réussie !');
        this.authService.setUser(user); // Set the user in the auth service
        if (user.isAdmin) {
          this.router.navigate(['/admin/dashboard']);
        }
        else {
          this.router.navigate(['/home']);
        }

      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Erreur inconnue lors de la connexion.';
        this.toastr.error(errorMsg, 'Erreur');
        console.error(err);
      }
      
    });
  }
}
