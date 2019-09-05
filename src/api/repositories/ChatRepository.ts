import Chat from '../models/Chat';

export default interface IChatRepository {
  create(chat: Chat): Promise<Chat>;
  findAll(): Promise<Array<Chat>>;
  findByUuid(uuid: string): Promise<Chat | null>;
  findByUserUuid(userUuid: string): Promise<Array<Chat> | null>;
}
