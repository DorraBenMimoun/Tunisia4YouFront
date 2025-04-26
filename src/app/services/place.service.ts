import { HttpClient, HttpParams } from '@angular/common/http';
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
    const formData = new FormData();
  
    formData.append('Name', place.name);
    formData.append('Category', place.category);
    formData.append('Description', place.description);
    formData.append('Address', place.address);
    formData.append('City', place.city);
    formData.append('Latitude', place.latitude.toString());
    formData.append('Longitude', place.longitude.toString());
    formData.append('PhoneNumber', place.phoneNumber);
  
    // Tags
    place.tags.forEach(tag => {
      formData.append('Tags', tag);
    });
  
    // Opening hours
    for (const day in place.openingHours) {
      if (place.openingHours.hasOwnProperty(day)) {
        formData.append(`OpeningHours[${day}]`, place.openingHours[day]);
      }
    }
  
    // Images (base64)
    place.images.forEach((base64Image, index) => {
      const blob = this.base64ToBlob(base64Image);
      formData.append('Images', blob, `image${index}.png`);
    });
  
    return this.http.post(`${this.apiUrl}/with-images`, formData);
  }
  

  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([ab], { type: mimeString });
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

  searchPlaces(
    name?: string,
    tags?: string[], // modifie ici
    category?: string,
    minRating?: number,
    city?: string
  ): Observable<{ data: Place[], message: string, count: number }> {
    let params = new HttpParams();
  
    if (name) params = params.set('name', name);
    if (category) params = params.set('category', category);
    if (minRating != null) params = params.set('minRating', minRating.toString());
    if (city) params = params.set('city', city);
    if (tags) {
      tags.forEach(tag => {
        params = params.append('tags', tag); // append pour liste
      });
    }
  
    return this.http.get<{ data: Place[], message: string, count: number }>(`${this.apiUrl}/search`, { params });
  }
  




}

