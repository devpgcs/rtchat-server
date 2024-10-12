import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CommonFields } from 'src/common/models/common-fields.model';

@Schema()
export class Message extends CommonFields {
  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, how are you?',
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: 'Whether the message has been seen or not',
    example: false,
  })
  @Prop({ default: false })
  seen: boolean;

  @ApiProperty({
    description: 'The chat where the message was sent',
    example: '60f1b2c9a1b4b1f3b4e8d2e1',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' })
  chat: string;

  @ApiProperty({
    description: 'The sender of the message',
    example: '60f1b2c9a1b4b1f3b4e8d2e1',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: string;

  @ApiPropertyOptional({
    description: 'The date when the message was seen',
    example: '2021-07-17T03:24:00.000Z',
  })
  @Prop({ default: null, type: Date })
  seenAt: Date | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.set('toJSON', {
  transform(_doc, ret, _options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export type MessageDocument = HydratedDocument<Message>;
