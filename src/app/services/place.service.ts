import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PlaceComponent } from '../components/admin/place/place.component';
import { TagPlace } from './tag.service';
export interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  city:string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  openingHours: { [key: string]: string };
  averageRating: number;
  reviewCount: number;
  tags: string[];
  images: string[];
}
@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private apiUrl = 'http://localhost:5066/places'; 

  constructor(private http: HttpClient) {}

  getAllPlaces(): Observable<{ data: Place[] }> {
    return this.http.get<{ data: Place[] }>(this.apiUrl);
  }

  getPlaceById(id: string): Observable<any> {
    return this.http.get<Place>(`${this.apiUrl}/${id}`);
  }

  createPlace(place: Place): Observable<any> {
    return this.http.post(this.apiUrl, place);
  }

  updatePlace(id: string, place: Place): Observable<any> {
    console.log('Updating place with ID:', id, 'and data:', place);
    return this.http.put(`${this.apiUrl}/${id}`, place);
  }

  deletePlace(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getAllTags(): Observable<TagPlace[]> {
    return this.http.get<{ data: TagPlace[] }>('https://localhost:5066/tags').pipe(
      map(response => response.data) // Extrait uniquement la propriété `data`
    );
  }
  getPlaceByName(name: string): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.apiUrl}/name/${name}`);
  }

}

