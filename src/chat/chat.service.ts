import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ChatMessage } from './entity/ChatMessage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/auth/user.service';
import { CreateChatMessageDTO } from './dto/ChatMessage.dto';
import { ChatAPIService } from './chat.api.service';

const relations = ['user'];

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage) private repo: Repository<ChatMessage>,
    private apiService: ChatAPIService,
    private userService: UserService,
  ) {}
  private logger = new Logger('Chat');

  async findOne(where: import('typeorm').FindOptionsWhere<ChatMessage>) {
    return await this.repo.findOne({ where, relations });
  }

  async find(where: import('typeorm').FindOptionsWhere<ChatMessage>) {
    return await this.repo.find({ where, relations });
  }

  async save(dto: CreateChatMessageDTO) {
    return await this.repo.save(dto);
  }

  async getHistoryByUID(userId: number): Promise<ChatMessage[]> {
    const user = await this.userService.getById(userId);
    return user.chat_messages;
  }

  async chat(userId: number, content: string) {
    if (!content || content.replaceAll(' ', '').length < 2)
      throw new BadRequestException('내용을 입력해주세요');
    await this.userService.getById(userId);
    await this.repo.save({
      user: { id: userId },
      content: content,
      sender_type: 'user',
    });
    this.logger.verbose('AI chat [User Message] Saved');
    // ChatBot API
    const response = await this.apiService.question(content);
    this.logger.verbose('AI chat [Response]');
    await this.repo.save({
      user: { id: userId },
      content: response,
      sender_type: 'ai',
    });
    this.logger.verbose('AI chat [AI Message] Saved');
    return response;
  }

  async getRisk(targetId: number) {
    const targetUser = await this.userService.getById(targetId);
    const pill_names: string[] = [];
    this.logger.debug(`AI risk user ${targetId}`, targetUser);
    targetUser.alarms?.forEach((alarm) => {
      this.logger.debug(`AI risk pills ${targetId} +${alarm.name}`);
      if (alarm.name != '') pill_names.push(alarm.name);
    });
    return await this.apiService.requestRisk(pill_names);
  }
}
