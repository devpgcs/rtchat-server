import { Request } from 'express';
import { ChatDocument } from 'src/chat/models/chat.model';
import { UserDocument } from 'src/user/models/user.model';

export interface EnhancedRequest extends Request {
  /**
   * The authenticated user
   */
  user: UserDocument;
  /**
   * The chat that the user is interacting with
   */
  chat?: ChatDocument;
}
