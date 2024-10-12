import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from './models/message.model';

import { ChatModule } from '../chat.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ChatModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
