import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service'; // Import the ChatService
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  providers: [ChatService],
  imports: [CommonModule, HttpClientModule],

  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  before: string = ''; // Holds the ID or timestamp of the last fetched message
  limit: number = 20; // Number of messages to fetch per request
  messageContent!: any;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages(); // Load messages when the component initializes
  }

  loadMessages(): void {
    this.chatService
      .getMessages(this.before, this.limit)
      .subscribe((messages: any[]) => {
        // If there are new messages, append them to the existing ones
        if (messages && messages.length > 0) {
          this.messages = [...messages, ...this.messages];
          // Update "before" to the ID or timestamp of the first message in the new batch
          this.before = messages[messages.length - 1].createdAt; // Adjust based on your schema
        }
      });
  }

  sendMessage(content: string): void {
    // Send a message logic (emitting socket event)
  }
  onScroll(): void {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer?.scrollTop === 0) {
      this.loadMessages(); // Load older messages when reaching the top of the container
    }
  }
}
