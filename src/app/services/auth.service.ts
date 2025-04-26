import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    photo?: string;
    createdAt?: string;
  };
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = 'http://localhost:5066'; 
  isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  register(data: { username: string; email: string; passwordHash: string }) {
    console.log("Appel HTTP vers le backend :", data); // 👈 log

    return this.http.post(`${this.baseUrl}/register`, data);
  }
  

  login(data: { username: string; password:string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }

  saveToken(token: string, userId: string, isAdmin: string): void {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));  
 this.isLoggedInSubject.next(true); 

  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id || null; // dépend de ce que ton .NET met dans le token
    } catch (e) {
      console.error('Invalid token');
      return null;
    }
  }
  

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin'); // Important!

    this.isLoggedInSubject.next(false);
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return JSON.parse(localStorage.getItem('isAdmin') || 'false');
  }
  
  
  
    
  isLoggedIn(): boolean {
      return !!localStorage.getItem('jwtToken');
    }

  getIsLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password/${token}`, {  newPassword });
  }

}
