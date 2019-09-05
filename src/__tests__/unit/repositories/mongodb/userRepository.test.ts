import mongoose from 'mongoose';
import UserMongoRepository from '../../../../database/mongodb/repository/UserRepository';
import UserSchema from '../../../../database/mongodb/models/user';
import User from '../../../../api/models/User';

let repository: UserMongoRepository;
let uuid: string;

describe('User mongo repository tests', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true
      });
      repository = new UserMongoRepository(UserSchema);
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('create new user', async () => {
    const user: User = new User({
      email: 'test@test.com',
      password: 'test_password',
      role: 'client'
    });
    await user.generateHashPassword();

    const result: User = await repository.create(user);
    uuid = result.uuid;
    expect<string>(result.role).toBe('client');
    expect<string>(result.email).toBe('test@test.com');
    expect<string>(uuid).not.toBe(null);
  });

  test('find all users', async () => {
    const users: Array<User> = await repository.findAll();

    expect<boolean>(Array.isArray(users)).toBe(true);
    expect<number>(users.length).toBe(1);
  });

  test('find user by email', async () => {
    const user: User | null = await repository.findByEmail('test@test.com');
    expect<boolean>(user != null).toBe(true);
    if (user != null) {
      expect<string>(user.role).toBe('client');
      expect<string>(user.email).toBe('test@test.com');
      expect<string>(user.uuid).toBe(uuid);
    }
  });

  test('find user by uuid', async () => {
    const user: User | null = await repository.findByUuid(uuid);
    expect<User | null>(user).not.toBe(null);
    if (user != null) {
      expect<string>(user.role).toBe('client');
      expect<string>(user.email).toBe('test@test.com');
      expect<string>(user.uuid).toBe(uuid);
    }
  });
});
