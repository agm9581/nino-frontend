import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from './chat.service'; // Import the ChatService
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WebsocketModule } from '../socket/socket.module';
import { SocketService } from '../socket/socket.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat',
  providers: [ChatService],
  imports: [
    CommonModule,
    HttpClientModule,
    WebsocketModule,
    ReactiveFormsModule,
    AuthModule,
    RouterModule,
  ],

  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  messages: any[] = [];
  before: string = ''; // Holds the ID or timestamp of the last fetched message
  limit: number = 20; // Number of messages to fetch per request
  messageContent!: any;
  messageForm: FormGroup = new FormGroup({
    message: new FormControl(''),
  });
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  private shouldScroll = true;

  constructor(
    private chatService: ChatService,
    private readonly socketService: SocketService,
    private readonly authService: AuthService,
    public router: Router
  ) {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  onScroll(): void {
    const el = this.chatContainer.nativeElement;
    const threshold = 1; // pixels from bottom to still count as "at bottom"
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    this.shouldScroll = atBottom;
  }

  private scrollToBottom(): void {
    try {
      const el = this.chatContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {
      console.error('Auto-scroll failed:', err);
    }
  }

  ngOnInit(): void {
    this.loadMessages(); // Load messages when the component initializes
    this.socketService.on('message').subscribe((message) => {
      console.log('New message received:', message);
      this.messages.push(message);
      this.messages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
  }

  loadMessages(): void {
    this.chatService
      .getMessages(this.before, this.limit)
      .subscribe((messages: any[]) => {
        if (messages && messages.length > 0) {
          this.messages = [...messages, ...this.messages];

          // Sort all messages by date ascending
          this.messages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          // Update 'before'
          this.before = messages[messages.length - 1].createdAt;
        }
      });
  }

  sendMessage(): void {
    const content = this.messageForm.get('message')?.value;
    if (!content) return;
    const createdAt = new Date().toISOString();
    console.log('Will emit message', content);

    this.socketService.emit('message', {
      content,
      createdAt,
    });

    this.messageForm.reset();
  }
  logOut() {
    this.authService.logOut();
  }
}
