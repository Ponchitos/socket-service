import Message from '../models/Message';

export default interface IMessageRepository {
  create(message: Message): Promise<Message>;
  findByChat(chat: string): Promise<Array<Message> | null>;
  findByUser(user: string): Promise<Array<Message> | null>;
  findByDate(date: Date): Promise<Array<Message> | null>;
}
