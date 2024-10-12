import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { NotFoundResponse } from 'src/common/models/not-found-response.model';
import { BadRequestResponse } from 'src/common/models/bad-request-response.model';
import { UnauthorizedResponse } from 'src/common/models/unauthorized-response.model';
import { InternalServerErrorResponse } from 'src/common/models/internal-server-error-response.model';

import { EnhancedRequest } from 'src/common/interfaces/enhanced-request.interface';
import { ForbiddenResponse } from 'src/common/models/forbidden-response.model';

import { Message } from './models/message.model';
import { MessageGuard } from './message.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('Message')
@ApiBearerAuth()
@ApiNotFoundResponse({ type: NotFoundResponse })
@ApiForbiddenResponse({ type: ForbiddenResponse })
@ApiBadRequestResponse({ type: BadRequestResponse })
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponse })
@UseGuards(MessageGuard)
@Controller('chat/:chatId/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: 'Creates a new message in a chat' })
  @ApiCreatedResponse({ type: Message })
  @Post()
  create(
    @Req() req: EnhancedRequest,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return this.messageService.create(req.chat!, req.user, createMessageDto);
  }
}
