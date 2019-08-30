import mongoose from 'mongoose';
import ChatMongoRepository from '../../../../database/mongodb/repository/ChatRepository';
import ChatSchema from '../../../../database/mongodb/models/chat';
import Chat from '../../../../api/model/Chat';
import User from '../../../../api/model/User';

async function createUser(): Promise<User> {
  const user: User = new User({
    email: 'test@test.com',
    password: 'test_password',
    role: 'client'
  });
  await user.generateHashPassword();

  return user;
}

describe('Chat mongo repository tests', () => {
  let repositoryChat: ChatMongoRepository;
  let uuidUser: string;
  let uuidChat: string;

  beforeAll(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true
      });
      repositoryChat = new ChatMongoRepository(ChatSchema);
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('create new chat', async () => {
    const user: User = await createUser();
    const chat: Chat = new Chat({
      name: 'test_name_chat',
      userUuid: user.uuid,
      description: 'test_description'
    });

    uuidChat = chat.uuid;
    uuidUser = chat.userUuid;

    const result: Chat = await repositoryChat.create(chat);
    expect<string>(result.userUuid).toBe(uuidUser);
    expect<string>(result.uuid).toBe(uuidChat);
    expect<string>(result.description).toBe('test_description');
    expect<string>(result.name).toBe('test_name_chat');
  });

  test('find all chats', async () => {
    const chats: Array<Chat> = await repositoryChat.findAll();

    expect<boolean>(Array.isArray(chats)).toBe(true);
    expect<number>(chats.length).toBe(1);
  });

  test('find chat by user uuid', async () => {
    const chats: Array<Chat> | null = await repositoryChat.findByUserUuid(
      uuidUser
    );

    expect<boolean>(chats != null).toBe(true);
    if (chats != null) {
      expect<boolean>(Array.isArray(chats)).toBe(true);
      expect<number>(chats.length).toBe(1);
    }
  });

  test('find chat by chat uuid', async () => {
    const chat: Chat | null = await repositoryChat.findByUuid(uuidChat);

    expect<boolean>(chat != null).toBe(true);
    if (chat != null) {
      expect<string>(chat.userUuid).toBe(uuidUser);
      expect<string>(chat.uuid).toBe(uuidChat);
      expect<string>(chat.description).toBe('test_description');
      expect<string>(chat.name).toBe('test_name_chat');
    }
  });
});
