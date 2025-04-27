import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private baseUrl: string = 'http://localhost:3000/chat/messages'; // Adjust to your backend API

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
