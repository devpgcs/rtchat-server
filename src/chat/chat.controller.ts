import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EnhancedRequest } from 'src/common/interfaces/enhanced-request.interface';
import { BadRequestResponse } from 'src/common/models/bad-request-response.model';
import { UnauthorizedResponse } from 'src/common/models/unauthorized-response.model';
import { InternalServerErrorResponse } from 'src/common/models/internal-server-error-response.model';

import { Chat } from './models/chat.model';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: BadRequestResponse })
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponse })
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Creates a new chat with at least one participant' })
  @ApiCreatedResponse({ type: Chat })
  @Post()
  create(
    @Req() req: EnhancedRequest,
    @Body() createChatDto: CreateChatDto,
  ): Promise<Chat> {
    return this.chatService.create(req.user, createChatDto);
  }

  @ApiOperation({ summary: 'Retrieves all chats the user is a participant in' })
  @ApiOkResponse({ type: [Chat] })
  @Get()
  findAll(
    @Req() req: EnhancedRequest,
    @Query() pagination: PaginationDto,
  ): Promise<Chat[]> {
    return this.chatService.findAll(req.user, pagination);
  }
}
