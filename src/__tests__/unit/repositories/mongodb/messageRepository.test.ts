import mongoose from 'mongoose';
import MessageMongoRepository from '../../../../database/mongodb/repository/MessageRepository';
import MessageSchema from '../../../../database/mongodb/models/message';
import Message from '../../../../api/model/Message';
import User from '../../../../api/model/User';
import Chat from '../../../../api/model/Chat';

let repository: MessageMongoRepository;
let uuidUser: string;
let uuidChat: string;

describe('Message mongo repository tests', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true
      });
      repository = new MessageMongoRepository(MessageSchema);
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('create new message', async () => {
    const user: User = new User({
      email: 'test@test.com',
      password: 'test_password',
      role: 'client'
    });
    const chat: Chat = new Chat({
      userUuid: user.uuid,
      name: 'test_name_chat',
      description: 'test_description'
    });
    const message: Message = new Message({
      user: user.uuid,
      chat: chat.uuid,
      message: 'test_message'
    });

    uuidUser = user.uuid;
    uuidChat = chat.uuid;

    const result: Message = await repository.create(message);
    expect<string>(result.user).toBe(uuidUser);
    expect<string>(result.chat).toBe(uuidChat);
    expect<string>(result.message).toBe('test_message');
  });

  test('find messages by uuid chat', async () => {
    const messages: Array<Message> | null = await repository.findByChat(
      uuidChat
    );

    expect<boolean>(messages != null).toBe(true);
    if (messages != null) {
      expect<boolean>(Array.isArray(messages)).toBe(true);
      expect<number>(messages.length).toBe(1);
    }
  });

  test('find messages by uuid user', async () => {
    const messages: Array<Message> | null = await repository.findByUser(
      uuidUser
    );

    expect<boolean>(messages != null).toBe(true);
    if (messages != null) {
      expect<boolean>(Array.isArray(messages)).toBe(true);
      expect<number>(messages.length).toBe(1);
    }
  });
});
