import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatUserPage } from './chat_user';
import {ChatService} from "../../providers/chat-service";

@NgModule({
  declarations: [
    ChatUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatUserPage),
  ],
  exports: [
    ChatUserPage
  ],
  providers:[
    ChatService
  ]
})
export class ChatUserPageModule {}
