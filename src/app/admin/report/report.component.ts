import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user/user.model';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})

export class ReportComponent {
  signalements: any[] = [];
  userId: string = localStorage.getItem('userId') || ''; // Récupérer l'ID de l'utilisateur connecté
  users: User[] = [];
  selectedUserReports: any[] = [];
  isModalOpen = false;
  reportedUsers: any[] = [];

  constructor(private userService: UserService , private reportService: ReportService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadSignalements();
    this.loadReportedUsers();


  }

  loadUsers() {
    this.userService.getAllUser().subscribe(users => {
      this.users = users.map(u => ({
        ...u,
        hasReports: true // ou appel rapide si besoin de pré-checker
      }));
    });
  }
  loadReportedUsers(): void {
    this.reportService.getReportedUsers().subscribe({
      next: (users) => {
        this.reportedUsers = users;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs signalés', err);
      }
    });
  }

  banUser(userId: string) {
    const dateFin = new Date();
    dateFin.setMonth(dateFin.getMonth() + 1); // banni pour 1 mois par exemple
  
    const dateFinISO = dateFin.toISOString(); // convertir en ISO string
  
    this.userService.banUser(userId, dateFinISO).subscribe({
      next: () => {
        alert('Utilisateur banni avec succès !');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Erreur lors du bannissement :', error);
      }
    });
  }
  loadSignalements(): void {
    this.reportService.getSignalementsByUser(this.userId).subscribe({
      next: (signalements: any[]) => {
        if (signalements.length === 0) {
          console.log('Aucun signalement trouvé.');
        } else {
          this.signalements = signalements;
          this.isModalOpen = true;
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des signalements:', error);
        alert(error);
      }
    });
  }

  
  hasReports(): boolean {
    return this.signalements.length > 0;
  }

  openReportsModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  
}