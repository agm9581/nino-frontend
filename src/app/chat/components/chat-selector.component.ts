import {
    Component,
    OnInit,

} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import { RouterModule } from '@angular/router';

import { Chat } from '../models/chat.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-chat-selector',


    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,

    ],

    templateUrl: './chat-selector.component.html',
    styleUrls: ['./chat-selector.component.scss'],
})
export class ChatSelectorComponent implements OnInit {

    openChats$: Observable<Chat[]>


    ngOnInit(): void {
        const newChat1 = new Chat()

        const newChat2 = new Chat()
        let chats = [newChat1, newChat2]

        this.openChats$ = new Observable(subscriber => {
            setTimeout(() => {
                subscriber.next(chats)


            }, 1000)


        },
        )

    }


}


