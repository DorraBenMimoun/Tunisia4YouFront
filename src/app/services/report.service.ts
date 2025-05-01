import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:5066/reports'; 

  constructor(private http: HttpClient) { }

  // Méthode pour signaler un commentaire
  reportReview(userId: string, reportedUserId: string, reviewId: string, reason: string): Observable<any> {
    const reportData = {
      userId: userId,
      reportedUserId: reportedUserId,
      reviewId: reviewId,
      reason: reason
    };

    return this.http.post(`${this.apiUrl}`, reportData);
  }
  getReportedUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reported-users`);
  }
  
  getSignalementsByUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reported/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError('Aucun signalement trouvé pour cet utilisateur.');
    } else {
      return throwError('Erreur lors du chargement des signalements.');
    }
  }
  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  getReviewById(id: string): Observable<any> {
    return this.http.get(`http://localhost:5066/reviews/${id}`);
  }
  
}