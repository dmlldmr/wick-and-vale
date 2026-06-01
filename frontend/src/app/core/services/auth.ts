import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {User} from '../models/user.model';

interface AuthResponse extends User {
  token: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response));
      })
    );
  }

  register(name: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/register`, { name, email, password });
  }

  updateProfile(name: string, email: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/profile`, { name, email }).pipe(
      tap(response => {
        const currentUser = this.getCurrentUser();
        localStorage.setItem('user', JSON.stringify({ ...currentUser, name: response.name, email: response.email }));
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/change-password`, { currentPassword, newPassword });
  }

  refreshAccessToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<RefreshTokenResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(response => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      })
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if(refreshToken) {
      this.http.post(`${this.apiUrl}/auth/logout`, { refreshToken }).subscribe();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }
}
