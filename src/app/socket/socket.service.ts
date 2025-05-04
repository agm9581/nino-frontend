import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private apiUrl: string = environment.apiUrl;

  constructor() {
    this.connect();
  }

  connect() {
    const token = localStorage.getItem('token');

    this.socket = io(environment.apiUrl, {
      auth: {
        token: localStorage.getItem('token'),
      },
      transports: ['websocket'], // Optional: force WebSocket transport
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
  }
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      // Handle cleanup
      return () => {
        this.socket.off(event);
      };
    });
  }
}
