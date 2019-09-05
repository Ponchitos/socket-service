import IMessageRepository from '../repositories/MessageRepository';
import Message from '../models/Message';

export interface IMessageService {
  repository: IMessageRepository;
  logger: any;
}

export interface IMessageReqCreate {
  userUuid: string;
  chatUuid: string;
  message: string;
}

export default class MessageService {
  private _repository: IMessageRepository;
  private _logger: any;

  constructor(data: IMessageService) {
    this._repository = data.repository;
    this._logger = data.logger;
  }

  async create(data: IMessageReqCreate): Promise<Message> {
    const message: Message = new Message({
      user: data.userUuid,
      chat: data.chatUuid,
      message: data.message
    });
    await this._repository.create(message);

    this._logger.info({
      action: 'message service: create',
      data,
      result: message.toString()
    });

    return message;
  }

  async findByChat(chatUuid: string): Promise<Array<Message> | null> {
    const result: Array<Message> | null = await this._repository.findByChat(
      chatUuid
    );
    this._logger.info({
      action: 'message service: find by chat',
      data: chatUuid,
      result
    });

    return result;
  }

  async findByDate(date: Date): Promise<Array<Message> | null> {
    const result: Array<Message> | null = await this._repository.findByDate(
      date
    );
    this._logger.info({
      action: 'message service: find by date',
      data: date,
      result
    });

    return result;
  }

  async findByUser(userUuid: string): Promise<Array<Message> | null> {
    const result: Array<Message> | null = await this._repository.findByUser(
      userUuid
    );
    this._logger.info({
      action: 'message service: find by user uuid',
      data: userUuid,
      result
    });

    return result;
  }
}
