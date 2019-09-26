import mongoose from 'mongoose';
import MessageService from '../../../api/services/MessageService';
import MessageMongoRepository from '../../../database/mongodb/repository/MessageRepository';
import MessageSchema from '../../../database/mongodb/models/message';
import logger from '../../../logger/winston';
import Chat from '../../../api/models/Chat';
import User from '../../../api/models/User';
import Message from '../../../api/models/Message';

let service: MessageService;
let chatUuid: string;
let userUuid: string;
let date: Date;

async function createUser(): Promise<User> {
  const user: User = new User({
    email: 'test@test.com',
    password: 'test_password',
    role: 'client'
  });
  await user.generateHashPassword();

  return user;
}

async function createChat(user: string): Promise<Chat> {
  return new Chat({
    userUuid: user,
    name: 'test_name_chat',
    description: 'test_description'
  });
}

describe('Message service test (mongodb - repository, winston - logger)', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true
      });
      const repository = new MessageMongoRepository(MessageSchema);
      service = new MessageService({ repository, logger });
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('create new message', async () => {
    const user: User = await createUser();
    const chat: Chat = await createChat(user.uuid);

    const message: Message = await service.create({
      userUuid: user.uuid,
      chatUuid: chat.uuid,
      message: 'test_message'
    });

    chatUuid = chat.uuid;
    userUuid = user.uuid;
    date = new Date(message.date_create);

    expect<string>(message.user).toBeDefined();
    expect<string>(message.chat).toBeDefined();
    expect<string>(message.message).toBe('test_message');
  });

  test('find messages by uuid chat', async () => {
    const messages: Array<Message> | null = await service.findByChat(chatUuid);

    expect<boolean>(messages != null).toBe(true);
    if (messages != null) {
      expect<boolean>(Array.isArray(messages)).toBe(true);
      expect<number>(messages.length).toBe(1);
    }
  });

  test('find messages by uuid user', async () => {
    const messages: Array<Message> | null = await service.findByUser(userUuid);

    expect<boolean>(messages != null).toBe(true);
    if (messages != null) {
      expect<boolean>(Array.isArray(messages)).toBe(true);
      expect<number>(messages.length).toBe(1);
    }
  });

  test('find messages by date', async () => {
    const messages: Array<Message> | null = await service.findByDate(date);

    expect<boolean>(messages != null).toBe(true);
    if (messages != null) {
      expect<boolean>(Array.isArray(messages)).toBe(true);
      expect<number>(messages.length).toBe(1);
    }
  });
});
