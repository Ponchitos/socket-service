import { Model } from 'mongoose';

import Chat from '../../../api/models/Chat';
import { IChat } from '../models/chat';
import IChatRepository from '../../../api/repositories/ChatRepository';

export default class ChatMongoRepository implements IChatRepository {
  private _model: Model<IChat>;

  constructor(chatModel: Model<IChat>) {
    this._model = chatModel;
  }

  async create(chat: Chat): Promise<Chat> {
    await this._model.create({
      uuid: chat.uuid,
      name: chat.name,
      description: chat.description,
      userUuid: chat.userUuid
    });
    return chat;
  }

  async findAll(): Promise<Array<Chat>> {
    const dbResult: Array<IChat> = await this._model.find();
    return dbResult.map<Chat>(
      chat =>
        new Chat({
          userUuid: chat.userUuid,
          name: chat.name,
          description: chat.description,
          uuid: chat.uuid,
          dateCreate: chat.dateCreate
        })
    );
  }

  async findByUserUuid(userUuid: string): Promise<Array<Chat> | null> {
    const dbResult: Array<IChat> | null = await this._model.find({ userUuid });
    if (dbResult != null) {
      return dbResult.map<Chat>(
        chat =>
          new Chat({
            userUuid: chat.userUuid,
            name: chat.name,
            description: chat.description,
            uuid: chat.uuid,
            dateCreate: chat.dateCreate
          })
      );
    }

    return null;
  }

  async findByUuid(uuid: string): Promise<Chat | null> {
    const dbResult: IChat | null = await this._model.findOne({ uuid });
    if (dbResult != null) {
      return new Chat({
        userUuid: dbResult.userUuid,
        name: dbResult.name,
        description: dbResult.description,
        uuid: dbResult.uuid,
        dateCreate: dbResult.dateCreate
      });
    }
    return null;
  }
}
