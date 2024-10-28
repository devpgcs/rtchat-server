import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';

export const MESSAGE_GATEWAY_SUBSCRIPTION = 'message-gateway-subscription';

@UseGuards(AuthGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(MESSAGE_GATEWAY_SUBSCRIPTION)
  handleMessage(@MessageBody() data): string {
    Logger.debug(data, 'MessageGateway');

    return data;
  }
}
