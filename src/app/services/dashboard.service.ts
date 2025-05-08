import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5066/stats';

  constructor(private http: HttpClient ) { }

  getUserStats() {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getPlaceStats() {
    return this.http.get(`${this.apiUrl}/places`);
  }

  getReviewStats() {
    return this.http.get(`${this.apiUrl}/reviews`);
  }

  getListStats() {
    return this.http.get(`${this.apiUrl}/lists`);
  }

  



}
