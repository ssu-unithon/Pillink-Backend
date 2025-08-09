import { User } from 'src/auth/entity/user.entity';
import { SENDER_TYPE } from '../entity/ChatMessage.entity';

export interface CreateChatMessageDTO {
  user: User;
  sender_type: SENDER_TYPE;
  content: string;
}
