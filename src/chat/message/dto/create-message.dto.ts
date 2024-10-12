import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { Message } from '../models/message.model';

export class CreateMessageDto implements Pick<Message, 'content'> {
  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, world!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
