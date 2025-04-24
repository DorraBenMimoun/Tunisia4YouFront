import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface List {
  id: string;
  nom: string;
  description: string;
  updatedAt : Date;
  createdAt: Date;
  isPrivate : boolean;
}
@Injectable({
  providedIn: 'root'
})
export class ListServices {
  private apiUrl = 'http://localhost:5066/listes';

  constructor(private http: HttpClient) {}

  getUserLists(): Observable<{ data: List[] }> {
    return this.http.get<{ data: List[] }>(`${this.apiUrl}/createur/${localStorage.getItem('userId')}`);
  }

  createList(list: List): Observable<any> {
    return this.http.post(this.apiUrl, list);
  }

  deleteList(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addPlaceToList(listId: string, placeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${listId}/places/${placeId}`, {});
  }


  removePlaceFromList(listId: string, placeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${listId}/places/${placeId}`);
  }

  getListContainingPlace(placeId: string): Observable<any> {
    return this.http.get<{ data: List[] }>(`${this.apiUrl}/me/places/${placeId}`);
  }

  getListById(id: string): Observable<List>{
  return this.http.get< List >(`${this.apiUrl}/${id}`);
  }
  
  getPlacesInList(id: string): Observable<any> {
    return this.http.get<{ data: List[] }>(`${this.apiUrl}/${id}/places`);
  }


  // getTagById(id: string): Observable<TagPlace> {
  //   return this.http.get<TagPlace>(`${this.apiUrl}/${id}`);
  // }


  // updateTag(id: string, tag: TagPlace): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}`, tag);
  // }

  // deleteTag(id: string): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
}

