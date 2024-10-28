import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/models/user.model';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { CreateChatDto } from './dto/create-chat.dto';
import { Chat, ChatDocument } from './models/chat.model';

@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  /**
   * Creates a new chat with at least one participant
   *
   * @param {UserDocument} user The authenticated user from the request
   * @param {CreateChatDto} createChatDto The data transfer object for creating a chat
   * @returns {Promise<Chat>} The created chat
   */
  async create(user: UserDocument, createChatDto: CreateChatDto): Promise<Chat> {
    // We create a set to ensure that there are no duplicate participants IDs
    const participants = new Set([
      ...(createChatDto.participants as unknown as string[]),
      user.id as string,
    ]);

    // If there are less than two participants, we throw an error
    if (participants.size < 2) {
      throw new BadRequestException('A chat must have at least two participants');
    }

    // We check if all participants exist in the database
    const existingParticipants = await this.userService.findMany(
      { _id: { $in: Array.from(participants) } },
      { id: 1 },
    );

    // Otherwise, if at least one participant does not exist, we throw an error
    if (existingParticipants.length !== participants.size) {
      throw new BadRequestException('One or more participants do not exist');
    }

    const newChat = new this.chatModel({
      participants: Array.from(participants),
    });

    const createdChat = await newChat.save();
    const updatedUser = await user.updateOne({ $push: { chats: createdChat.id } }, { new: true });

    Logger.debug(updatedUser, this.constructor.name + ' - updatedUser');

    return createdChat.toJSON();
  }

  /**
   * Retrieves all chats the user is a participant in and such chats have messages
   *
   * @param {UserDocument} user The authenticated user from the request
   * @param {PaginationDto} pagination The pagination data transfer object
   * @returns {Promise<Chat[]>} The chats the user is a participant in
   */
  findAll(user: UserDocument, pagination: PaginationDto): Promise<Chat[]> {
    return this.chatModel
      .find({
        participants: user.id,
        messages: { $exists: true, $not: { $size: 0 } },
      })
      .populate([
        { path: 'participants', select: 'id username' },
        {
          path: 'messages',
          select: 'id content sender seen',
          options: { limit: 1, sort: { createdAt: 'desc' } },
        },
      ])
      .select('id participants messages')
      .limit(pagination.limit)
      .skip(pagination.skip)
      .sort({ updatedAt: 'desc' })
      .exec();
  }

  /**
   * Finds a chat by its ID and the user that is a participant in it to
   * be injected into the request object from the MessageGuard.
   *
   * @param {string} chatId The ID of the chat
   * @param {UserDocument} user The authenticated user from the request
   * @returns {Promise<ChatDocument | null>} The chat found or null if not found
   */
  findByParticipant(chatId: string, user: UserDocument): Promise<ChatDocument | null> {
    return this.chatModel.findOne({ _id: chatId, participants: user.id }).select('id').exec();
  }
}
