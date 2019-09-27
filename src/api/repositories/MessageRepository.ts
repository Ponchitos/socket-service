import Message from '../models/Message';

export default interface IMessageRepository {
  create(message: Message): Promise<Message>;
  findByChat(chat: string): Promise<Array<Message>>;
  findByUser(user: string): Promise<Array<Message>>;
  findByDate(date: Date): Promise<Array<Message>>;
}
