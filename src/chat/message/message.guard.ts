import { isMongoId } from 'class-validator';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { EnhancedRequest } from 'src/common/interfaces/enhanced-request.interface';

import { ChatService } from '../chat.service';

@Injectable()
export class MessageGuard implements CanActivate {
  constructor(private readonly chatService: ChatService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: EnhancedRequest = context.switchToHttp().getRequest();

    const chatId = request.params.chatId;

    if (!isMongoId(chatId)) {
      throw new BadRequestException('Invalid chat ID');
    }

    switch (request.method) {
      case 'POST':
        return this.canActivatePost(request, chatId);
      default:
        return false;
    }
  }

  /**
   * Validates if the user is a participant in the chat before creating a message.
   *
   * @param {EnhancedRequest} request The request object.
   * @param {string} chatId The chat ID where the message will be created.
   * @returns {Promise<boolean>} A boolean indicating if the user can create a message.
   */
  async canActivatePost(
    request: EnhancedRequest,
    chatId: string,
  ): Promise<boolean> {
    const chatWhereParticipant = await this.chatService.findByParticipant(
      chatId,
      request.user,
    );

    if (!chatWhereParticipant) {
      throw new ForbiddenException(
        'You cannot access this resource because you are not a participant in the chat',
      );
    }

    // Since we need it for inserting the message, we attach the chat to the request
    request.chat = chatWhereParticipant;

    return true;
  }
}
