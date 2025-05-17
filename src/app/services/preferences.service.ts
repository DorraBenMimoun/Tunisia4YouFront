import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Preferences {
  preferredTags: string[];
  preferredCities: string[];
  preferredCategories: string[];
  minRating: number;
  priceRange: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private apiUrl = 'http://localhost:5066/preferences'; 


  constructor(private http: HttpClient) { }

  getUserPreferences(userId: string): Observable<Preferences> {
    return this.http.get<Preferences>(`${this.apiUrl}/${userId}`);
  }

  createOrUpdatePreferences(preferences: Preferences): Observable<Preferences> {
    return this.http.post<Preferences>(this.apiUrl, preferences);
  }
} 