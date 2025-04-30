import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

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
  dateFinBannissement?: string | null; 
  isBanni?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:5066/users'; 

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
  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`).pipe(
      map(users => users.map(user => this.checkAndUnban(user)))
    );
  }

  getUserId(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(
      map(user => this.checkAndUnban(user))
    );
  }

  private checkAndUnban(user: User): User {
    if (user.dateFinBannissement) {
      const now = new Date();
      const banEndDate = new Date(user.dateFinBannissement);
      if (banEndDate <= now) {
        user.dateFinBannissement = null;
        user.isBanni = false;
      } else {
        user.isBanni = true;
      }
    } else {
      user.isBanni = false;
    }
    return user;
  }
  banUser(userId: string, dateFinBannissement: string) {
    return this.http.patch(`http://localhost:5066/users/${userId}/ban`, JSON.stringify(dateFinBannissement), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  getReportsForUser(userId: string) {
    return this.http.get<any[]>(`http://localhost:5066/reports/user/${userId}`);
  }
  
  
  
  


  
  
  
}
