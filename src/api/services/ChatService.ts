import IChatRepository from '../repositories/ChatRepository';
import Chat from '../models/Chat';

export interface IChatService {
  repository: IChatRepository;
  logger: any;
}

export interface IChatReqCreate {
  name: string;
  userUuid: string;
  description: string;
}

export default class ChatService {
  private _repository: IChatRepository;
  private _logger: any;

  constructor(data: IChatService) {
    this._repository = data.repository;
    this._logger = data.logger;
  }

  async create(data: IChatReqCreate): Promise<Chat> {
    const chat: Chat = new Chat({
      name: data.name,
      userUuid: data.userUuid,
      description: data.description
    });
    await this._repository.create(chat);

    this._logger.info({
      action: 'chat service: create',
      data,
      result: chat.toString()
    });

    return chat;
  }

  async findAll(): Promise<Array<Chat>> {
    const result: Array<Chat> = await this._repository.findAll();
    this._logger.info({ action: 'chat service: find all', result });

    return result;
  }

  async findByUuid(uuid: string): Promise<Chat | null> {
    const result: Chat | null = await this._repository.findByUuid(uuid);
    this._logger.info({
      action: 'chat service: find chat by uuid',
      data: uuid,
      result
    });

    return result;
  }

  async findByUserUuid(userUuid: string): Promise<Array<Chat> | null> {
    const result: Array<Chat> | null = await this._repository.findByUserUuid(
      userUuid
    );
    this._logger.info({
      action: 'chat service: find chats by user uuid',
      data: userUuid,
      result
    });

    return result;
  }
}
