import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WebsocketModule } from '../socket/socket.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '../auth/auth.module';
import { RouterModule } from '@angular/router';
import { ChatSelectorComponent } from './components/chat-selector.component';
import { ChannelComponent } from './channel.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    WebsocketModule,
    ReactiveFormsModule,
    AuthModule,
    RouterModule,
    ChatSelectorComponent,
    ChannelComponent,
  ],
})
export class ChatModule {}
