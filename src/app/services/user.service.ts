import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  photo?: string;
  createdAt?: string;
  isAdmin?: boolean;
  currentPassword?: string;
  newPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://localhost:7056/users'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken'); // Assuming the token is stored here
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getUserById(id: string): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.baseUrl}/${id}`, { headers });
  }

  updateUser(id: string, userData: Partial<User>): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/${id}`, userData, { headers });
  }

  deleteUser(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(this.baseUrl, { headers });
  }
  
}
