import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('Place ID:', this.placeId); // Vérifiez si l'ID du lieu est bien récupéré
    // Récupérer l'ID de l'utilisateur connecté
  this.userId = this.authService.getUserId()!;
    // Récupérer l'ID du lieu à partir de l'URL
    //this.placeId = this.activatedRoute.snapshot.paramMap.get('placeId') || '';

  }
  
  submitReview() {
 
  
    const review = {
      commentaire: this.commentaire.trim(),
      note: this.note,
      userId: this.userId,
      placeId: this.placeId
    };
  
    console.log('Review envoyée :', review);
  
    this.reviewService.createReview(review).subscribe({
      next: (res) => {
        this.toastr.success('Commentaire ajouté avec succès !');
        this.resetForm();
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
}
