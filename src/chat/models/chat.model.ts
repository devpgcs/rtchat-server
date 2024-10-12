import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from 'src/user/models/user.model';
import { CommonFields } from 'src/common/models/common-fields.model';

import { Message } from '../message/models/message.model';

@Schema()
export class Chat extends CommonFields {
  @ApiProperty({ description: 'The messages of the chat', type: [Message] })
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }])
  messages: Message[];

  @ApiProperty({
    description: 'The participants of the chat',
    type: [User],
  })
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  participants: User[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.set('toJSON', {
  transform(_doc, ret, _options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export type ChatDocument = HydratedDocument<Chat>;
