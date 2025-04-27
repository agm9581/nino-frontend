import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  // Example method to check if the user is logged in
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Assuming token is stored in localStorage
  }
  async login(email: string, password: string) {
    this.http.post('http://localhost:3000/auth/login', { email, password });
  }
}
