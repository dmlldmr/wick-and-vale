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
}
