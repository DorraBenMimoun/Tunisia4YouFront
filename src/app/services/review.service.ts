import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Review {
  commentaire: string;
  note: number;
  userId: string;
  placeId: string;
}
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:5066/reviews';  // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  // Méthode pour créer un nouvel avis
  createReview(review: Review): Observable<any> {
    return this.http.post<any>(this.apiUrl, review);
  }

}
