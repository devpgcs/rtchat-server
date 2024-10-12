import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Chat } from 'src/chat/models/chat.model';
import { CommonFields } from 'src/common/models/common-fields.model';

@Schema()
export class User extends CommonFields {
  @ApiProperty({
    description: 'The username of the user',
    example: 'amazingchat',
  })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+57 123 456 7890',
  })
  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }])
  chats: Chat[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform(_doc, ret, _options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

export type UserDocument = HydratedDocument<User>;
