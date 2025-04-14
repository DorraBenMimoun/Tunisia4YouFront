import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userData: any = {
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    photo: '',
  };
  previewUrl: string | null = null; // Pour l'aperçu de la photo avant envoi
  successMessage: string = '';
  errorMessage: string = '';
  showPhotoUpload = false; // Contrôle l'affichage du champ de sélection de fichier

  constructor(private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    const userId = this.getUserIdFromToken();
    console.log('User ID:', userId);
  
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (user) => {
          console.log('User fetched:', user);
          this.userData = user;
        },
        (error) => {
          this.errorMessage = 'Erreur lors du chargement des informations.';
        }
      );
    } else {
      this.errorMessage = 'Utilisateur non authentifié.';
    }
  }
  
  
  

  // Gestion du changement de mot de passe
  
  
  togglePhotoUpload(): void {
    this.showPhotoUpload = !this.showPhotoUpload; // Affiche ou masque le champ de sélection de fichier
  }
  // Gérer l'upload de la photo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string; // Créer un aperçu de l'image
        this.userData.photo = this.previewUrl; // Assigner la photo au modèle
      };
      reader.readAsDataURL(file);
    }
  }

  // Gérer la suppression du compte
  onDelete(): void {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer votre compte ?');
    if (confirmation) {
      this.userService.deleteUser(this.userData.id).subscribe(
        (response) => {
          this.router.navigate(['/signup']); // Redirige l'utilisateur après suppression
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la suppression du compte.';
        }
      );
    }
  }
  getUserIdFromToken(): string | null {
    return localStorage.getItem('userId')
      || localStorage.getItem('userData') // Si le userId est stocké dans le token;
  }
  
 
  
  onSave(): void {
  

    this.userService.updateUser(this.userData.id, this.userData).subscribe(
      (response) => {
        this.successMessage = 'Profil mis à jour avec succès!';
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour du profil.';
      }
    );
    if (this.previewUrl) {
      // Logique pour sauvegarder la nouvelle photo
      console.log('Nouvelle photo sélectionnée :', this.previewUrl);
      this.userData.photo = this.previewUrl as string; // Met à jour la photo de profil
    }
    // Logique pour sauvegarder les autres données utilisateur
    localStorage.setItem('userData', JSON.stringify(this.userData));
    this.successMessage = 'Profil mis à jour avec succès!';
    console.log('Données utilisateur mises à jour :', this.userData);  } 
}


