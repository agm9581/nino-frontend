import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from './socket.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [SocketService],
})
export class WebsocketModule {}
