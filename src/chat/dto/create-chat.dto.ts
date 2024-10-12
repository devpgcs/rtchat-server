import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsMongoId } from 'class-validator';

import { User } from 'src/user/models/user.model';

import { Chat } from '../models/chat.model';

export class CreateChatDto implements Pick<Chat, 'participants'> {
  @ApiProperty({
    description: 'The participants of the chat',
    example: ['60f1b2c9a1b4b1f3b4e8d2e1'],
  })
  @IsMongoId({ each: true })
  @ArrayNotEmpty()
  participants: User[];
}
