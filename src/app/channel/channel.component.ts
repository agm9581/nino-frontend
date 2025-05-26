import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChannelService } from './channel.service';
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
import { ChatSelectorComponent } from "./components/chat-selector.component";

@Component({
  selector: 'app-channel',
  providers: [ChannelService],
  imports: [
    CommonModule,
    HttpClientModule,
    WebsocketModule,
    ReactiveFormsModule,
    AuthModule,
    RouterModule,
    ChatSelectorComponent

  ],

  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit, AfterViewChecked {
  messages: any[] = [];
  before: string = ''; // Holds the ID or timestamp of the last fetched message
  limit: number = 20; // Number of messages to fetch per request
  messageContent!: any;
  messageForm: FormGroup = new FormGroup({
    message: new FormControl(''),
  });
  @ViewChild('channelContainer') private channelContainer!: ElementRef;
  private shouldScroll = true;

  constructor(
    private channelService: ChannelService,
    private readonly socketService: SocketService,
    private readonly authService: AuthService,
    public router: Router
  ) { }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  onScroll(): void {
    const el = this.channelContainer.nativeElement;
    const threshold = 1; // pixels from bottom to still count as "at bottom"
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    this.shouldScroll = atBottom;
  }

  private scrollToBottom(): void {
    try {
      const el = this.channelContainer.nativeElement;
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
    this.channelService
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
