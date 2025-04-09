import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface TagPlace {
  id: string;
  libelle: string;
}
@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = 'https://localhost:7056/tags'; 

  constructor(private http: HttpClient) {}
  getAllTags(): Observable<{ data: TagPlace[] }> {
    return this.http.get<{ data: TagPlace[] }>(this.apiUrl);
  }

  getTagById(id: string): Observable<TagPlace> {
    return this.http.get<TagPlace>(`${this.apiUrl}/${id}`);
  }

  createTag(tag: TagPlace): Observable<any> {
    return this.http.post(this.apiUrl, tag);
  }

  updateTag(id: string, tag: TagPlace): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tag);
  }

  deleteTag(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
