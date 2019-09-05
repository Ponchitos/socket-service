import mongoose from 'mongoose';
import SignIn, { ISignInResponse } from '../../../../api/controllers/signin';
import UserService from '../../../../api/services/UserService';
import UserMongoRepository from '../../../../database/mongodb/repository/UserRepository';
import UserSchema from '../../../../database/mongodb/models/user';
import logger from '../../../../logger';
import User from '../../../../api/models/User';
import { ISuccessResponse } from '../../../../api/response/response';

let controller: SignIn;
let uuid: string;

describe('SignIn controller test (mongodb - repository, winston - logger)', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true
      });
      const repository = new UserMongoRepository(UserSchema);
      const service = new UserService({ repository, logger });
      const user: User = await service.create({
        email: 'test@test.test',
        password: 'test_passport',
        role: 'client'
      });
      uuid = user.uuid;
      controller = new SignIn(service);
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('SignIn: success case', async () => {
    const result: ISuccessResponse<ISignInResponse> = await controller.singIn({
      email: 'test@test.test',
      password: 'test_passport'
    });

    expect<string>(result.statusCode).toBe('OK');
    expect<string>(result.data.uuid).toBe(uuid);
  });

  test('SignIn: wrong case - user not found', async () => {
    await expect<Promise<ISuccessResponse<ISignInResponse>>>(
      controller.singIn({ email: 'test2@test.test', password: 'test' })
    ).rejects.toThrow('User not found');
  });

  test('SignIn: wrong case - Not valid login data', async () => {
    await expect<Promise<ISuccessResponse<ISignInResponse>>>(
      controller.singIn({ email: 'test@test.test', password: 'test' })
    ).rejects.toThrow('Not valid login data');
  });

  test('Auth: success case', async () => {
    const result: ISuccessResponse<boolean> = await controller.auth(uuid);

    expect<boolean>(result.data).toBeTruthy();
  });

  test('Auth: wrong case - User not found', async () => {
    await expect<Promise<ISuccessResponse<boolean>>>(
      controller.auth('test')
    ).rejects.toThrow('User not found');
  });
});
