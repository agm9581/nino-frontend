import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}

  // Example method to check if the user is logged in
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Assuming token is stored in localStorage
  }
  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((response) => response),
        catchError((err) => {
          return throwError(() => err);
        })
      );
  }
  register(email: string, password: string): Observable<string> {
    return this.http
      .post<string>(`${this.apiUrl}/auth/register`, {
        email,
        password,
      })
      .pipe(
        map((response) => response),
        catchError((err) => {
          return throwError(() => err);
        })
      );
  }
}
