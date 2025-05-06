import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;
  private baseUrl: string = `${this.apiUrl}/chat/messages`; // Adjust to your backend API

  constructor(private http: HttpClient) {}

  getMessages(before: string = '', limit: number = 20): Observable<any> {
    let params = new HttpParams();
    if (before) {
      params = params.set('before', before); // Use message ID or timestamp to load older messages
    }
    params = params.set('limit', limit.toString());

    return this.http.get(this.baseUrl, { params });
  }
}
