import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'] // Attention: c'est styleUrls avec un 's'
})
export class ReviewComponent implements OnInit {
  commentaire: string = '';
  note: number = 0;
  userId: string = '';
  //placeId: string = '';
  @Input() placeId!: string;
  userName: string = '';

  reviews: any[] = [];
  reason: string = 'Inappropriate content';
    isModalOpen: boolean = false;
    selectedReviewId: string = ''; 
    selectedReportedUserId: string = '';
  constructor(
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    console.log('Place ID:', this.placeId); // Vérifiez si l'ID du lieu est bien récupéré
    // Récupérer l'ID de l'utilisateur connecté
  this.userId = this.authService.getUserId()!;
    // Récupérer l'ID du lieu à partir de l'URL
    //this.placeId = this.activatedRoute.snapshot.paramMap.get('placeId') || '';
    this.loadReviews();

  }
  loadReviews(): void {
    this.reviewService.getReviewsByPlace(this.placeId).subscribe({
      next: (res) => {
        this.reviews = res.data || [];
        this.reviews.forEach(review => {
          this.authService.getUserNameById(review.userId).subscribe({
            next: (user) => {
              review.userName = user.name;
            },
            error: (err) => {
              console.error('Erreur en récupérant le username pour', review.userId, err);
              review.userName = 'Utilisateur';
            }
          });
        });
      },
      error: (err) => console.error('Erreur lors du chargement des commentaires', err)
    });
  }
  
  
  
  
  submitReview() {
    const userName = this.userName;
    const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;
  
    const review = {
      commentaire: this.commentaire.trim(),
      note: this.note,
      userId: this.userId,
      userName: this.userName, 
      userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userName)}`,
      placeId: this.placeId
    };
  
    console.log('Review envoyée :', review);
  
    this.reviewService.createReview(review).subscribe({
      next: (res) => {
        this.toastr.success('Commentaire ajouté avec succès !');
        this.resetForm();
        this.loadReviews(); 
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.toastr.error('Erreur lors de l\'ajout du commentaire.');
      }
    });
  }
  
  

  resetForm(): void {
    this.commentaire = '';
    this.note = 0;
  }
  deleteReview(reviewId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.toastr.success('Commentaire supprimé avec succès !');
          this.loadReviews(); // Recharger les reviews après suppression
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du commentaire :', err);
          this.toastr.error('Erreur lors de la suppression.');
        }
      });
    }}
    openReportModal(reviewId: string, reportedUserId: string): void {
      this.isModalOpen = true;
      this.selectedReviewId = reviewId;
      this.selectedReportedUserId = reportedUserId;
    }
  
    // Fermer la fenêtre modale
    closeReportModal(): void {
      this.isModalOpen = false;
    }
  
    // Soumettre le signalement
    submitReport(): void {
      this.reportService.reportReview(this.userId, this.selectedReportedUserId, this.selectedReviewId, this.reason).subscribe(
        (response) => {
          // Gérer la réponse du backend, afficher un message de succès
          alert('Commentaire signalé avec succès!');
          this.closeReportModal(); // Fermer la modale après soumission
        },
        (error) => {
          // Gérer les erreurs, afficher un message d'erreur
          alert('Erreur lors du signalement du commentaire.');
        }
      );
    }
  }
  
  

