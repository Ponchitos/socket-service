import { Model } from 'mongoose';

import Message from '../../../api/models/Message';
import { IMessage } from '../models/message';
import IMessageRepository from '../../../api/repositories/MessageRepository';

export default class MessageMongoRepository implements IMessageRepository {
  private _model: Model<IMessage>;

  constructor(messageModel: Model<IMessage>) {
    this._model = messageModel;
  }

  async create(message: Message): Promise<Message> {
    await this._model.create({
      message: message.message,
      date: message.date_create,
      chat: message.chat,
      user: message.user
    });
    return message;
  }

  async findByChat(chat: string): Promise<Array<Message>> {
    const dbResult: Array<IMessage> = await this._model.find({ chat });
    return dbResult.map<Message>(
      message =>
        new Message({
          user: message.user,
          chat: message.chat,
          message: message.message,
          date: message.date
        })
    );
  }

  async findByDate(date: Date): Promise<Array<Message>> {
    const dbResult: Array<IMessage> = await this._model.find({ date });
    return dbResult.map<Message>(
      message =>
        new Message({
          user: message.user,
          chat: message.chat,
          message: message.message,
          date: message.date
        })
    );
  }

  async findByUser(user: string): Promise<Array<Message>> {
    const dbResult: Array<IMessage> = await this._model.find({ user });
    return dbResult.map<Message>(
      message =>
        new Message({
          user: message.user,
          chat: message.chat,
          message: message.message,
          date: message.date
        })
    );
  }
}
