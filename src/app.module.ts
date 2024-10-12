import { APP_GUARD } from '@nestjs/core';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './chat/message/message.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/rtchat'),
    ChatModule,
    MessageModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}