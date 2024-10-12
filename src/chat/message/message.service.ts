import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { Message } from './models/message.model';
import { UserDocument } from 'src/user/models/user.model';
import { CreateMessageDto } from './dto/create-message.dto';

import { ChatDocument } from '../models/chat.model';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  /**
   * Creates a new message in a chat and updates the chat with the new message
   *
   * @param {ChatDocument} chat The chat where the message will be created
   * @param {UserDocument} sender The authenticated user from the request
   * @param {CreateMessageDto} createMessageDto The data transfer object for creating a message
   * @returns {Promise<Message>} The created message
   */
  async create(
    chat: ChatDocument,
    sender: UserDocument,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const newMessage = new this.messageModel({
      chat,
      sender,
      content: createMessageDto.content,
    });

    const createdMessage = await newMessage.save();

    const updatedChat = await chat.updateOne(
      { $push: { messages: createdMessage.id }, updatedAt: new Date() },
      { new: true },
    );

    // We log the updated chat to the console for debugging purposes
    Logger.debug(updatedChat, this.constructor.name);

    return createdMessage.toJSON();
  }
}
