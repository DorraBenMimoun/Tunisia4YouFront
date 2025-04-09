import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7056'; 

  constructor(private http: HttpClient) {}

  register(data: { username: string; passwordHash: string }) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: { username: string; passwordHash: string; email?: string; photo?: string; isAdmin?: boolean }) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }
}
