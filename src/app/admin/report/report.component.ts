import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user/user.model';
import { ReportService } from '../../services/report.service';
import { forkJoin } from 'rxjs';

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
  allReports: any[] = [];
  selectedReports: any[] | null = null;
selectedUser: any | null = null;

  constructor(private userService: UserService , private reportService: ReportService) {}

  ngOnInit() {
    this.loadSignalements();
    this.loadReportedUsers();


  }


  loadReportedUsers() {
    this.reportService.getAllReports().subscribe({
      next: (reports) => {
        this.allReports = reports;

        const uniqueUserIds = [
          ...new Set(reports.map((r: any) => r.reportedUserId)),
        ];

        this.userService.getAllUsers().subscribe((users) => {
          this.reportedUsers = users.filter((user: any) =>
            uniqueUserIds.includes(user.id)
          );
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des signalements', err);
      },
    });
  }

  hasReportsForUser(userId: string): boolean {
    return this.allReports.some((r) => r.reportedUserId === userId);
  }



  banUser(userId: string) {
    const dateFin = new Date();
    dateFin.setMonth(dateFin.getMonth() + 1); // banni pour 1 mois par exemple
  
    const dateFinISO = dateFin.toISOString(); // convertir en ISO string
  
    this.userService.banUser(userId, dateFinISO).subscribe({
      next: () => {
        alert('Utilisateur banni avec succès !');
        this.loadReportedUsers();
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

  
  openReportsModal(userId: string) {
    this.selectedUser = this.reportedUsers.find((u) => u.id === userId);
  
    const reports = this.allReports.filter((r) => r.reportedUserId === userId);
  
    const reviewRequests = reports.map((report) =>
      this.reportService.getReviewById(report.reviewId)
    );
   
    forkJoin(reviewRequests).subscribe({
      next: (reviews) => {
        this.selectedReports = reports.map((report, index) => ({
          ...report,
          reviewContent: reviews[index]?.commentaire ,
        }));
        this.isModalOpen = true;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des avis signalés', err);
        this.selectedReports = reports.map((report) => ({
          ...report,
          reviewContent: 'Erreur de chargement du contenu',
        }));
        this.isModalOpen = true;
      }})}
    
  
  closeModal() {
    this.selectedReports = null;
    this.selectedUser = null;
  }

  }

  
