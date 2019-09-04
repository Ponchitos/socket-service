import mongoose from 'mongoose';
import ChatService from '../../../api/service/ChatService';
import ChatMongoRepository from '../../../database/mongodb/repository/ChatRepository';
import ChatSchema from '../../../database/mongodb/models/chat';
import logger from '../../../logger';
import Chat from '../../../api/model/Chat';
import User from '../../../api/model/User';

let service: ChatService;
let chatUuid: string;
let userUuid: string;

async function createUser(): Promise<User> {
  const user: User = new User({
    email: 'test@test.com',
    password: 'test_password',
    role: 'client'
  });
  await user.generateHashPassword();

  return user;
}

describe('Chat service test (mongodb - repository, winston - logger)', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true
      });
      const repository = new ChatMongoRepository(ChatSchema);
      service = new ChatService({ repository, logger });
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('create new chat', async () => {
    const user: User = await createUser();
    const chat: Chat = await service.create({
      name: 'test_name_chat',
      userUuid: user.uuid,
      description: 'test_description'
    });

    chatUuid = chat.uuid;
    userUuid = chat.userUuid;

    expect<string>(chat.userUuid).toBe(userUuid);
    expect<string>(chat.uuid).toBe(chatUuid);
    expect<string>(chat.description).toBe('test_description');
    expect<string>(chat.name).toBe('test_name_chat');
  });

  test('find all chats', async () => {
    const chats: Array<Chat> = await service.findAll();

    expect<boolean>(Array.isArray(chats)).toBe(true);
    expect<number>(chats.length).toBe(1);
  });

  test('find chat by user uuid', async () => {
    const chats: Array<Chat> | null = await service.findByUserUuid(userUuid);

    expect<boolean>(chats != null).toBe(true);
    if (chats != null) {
      expect<boolean>(Array.isArray(chats)).toBe(true);
      expect<number>(chats.length).toBe(1);
    }
  });

  test('find chat by chat uuid', async () => {
    const chat: Chat | null = await service.findByUuid(chatUuid);

    expect<boolean>(chat != null).toBe(true);
    if (chat != null) {
      expect<string>(chat.userUuid).toBe(userUuid);
      expect<string>(chat.uuid).toBe(chatUuid);
      expect<string>(chat.description).toBe('test_description');
      expect<string>(chat.name).toBe('test_name_chat');
    }
  });
});
