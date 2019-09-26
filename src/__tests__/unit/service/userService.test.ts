import mongoose from 'mongoose';
import UserService from '../../../api/services/UserService';
import UserMongoRepository from '../../../database/mongodb/repository/UserRepository';
import UserSchema from '../../../database/mongodb/models/user';
import logger from '../../../logger/winston';
import User from '../../../api/models/User';

let service: UserService;
let uuid: string;

describe('User service test (mongodb - repository, winston - logger)', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true
      });
      const repository = new UserMongoRepository(UserSchema);
      service = new UserService({ repository, logger });
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('create new user', async () => {
    const user: User = await service.create({
      email: 'test@test.com',
      password: 'test_password',
      role: 'client'
    });
    uuid = user.uuid;

    expect<string>(user.email).toBe('test@test.com');
    expect<string>(user.role).toBe('client');
    expect<string>(user.uuid).toBeDefined();
    expect<number>(user.passwordHash.length).not.toBe(0);
  });

  test('find all users', async () => {
    const users: Array<User> = await service.findAll();

    expect<boolean>(Array.isArray(users)).toBe(true);
    expect<number>(users.length).toBe(1);
  });

  test('find user by email', async () => {
    const user: User | null = await service.findByEmail('test@test.com');
    expect<boolean>(user != null).toBe(true);
    if (user != null) {
      expect<string>(user.role).toBe('client');
      expect<string>(user.email).toBe('test@test.com');
      expect<string>(user.uuid).toBe(uuid);
    }
  });

  test('find user by uuid', async () => {
    const user: User | null = await service.findByUuid(uuid);
    expect<User | null>(user).not.toBe(null);
    if (user != null) {
      expect<string>(user.role).toBe('client');
      expect<string>(user.email).toBe('test@test.com');
      expect<string>(user.uuid).toBe(uuid);
    }
  });
});
