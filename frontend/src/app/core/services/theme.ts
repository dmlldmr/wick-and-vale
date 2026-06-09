import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Theme {
  id: number;
  themeType: string;
  description: string;
  coverImage: string;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private apiUrl = environment.apiUrl + '/themes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Theme[]> {
    return this.http.get<Theme[]>(this.apiUrl);
  }

  getById(id: number): Observable<Theme> {
    return this.http.get<Theme>(`${this.apiUrl}/${id}`);
  }

  create(body: { themeType: string; description: string }): Observable<Theme> {
    return this.http.post<Theme>(this.apiUrl, body);
  }

  update(id: number, body: { themeType?: string; description?: string; coverImage?: string }): Observable<Theme> {
    return this.http.put<Theme>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(id: number, file: File): Observable<Theme> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.patch<Theme>(`${this.apiUrl}/${id}/image`, formData);
  }
}
