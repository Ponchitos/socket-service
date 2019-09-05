import mongoose from 'mongoose';
import SignUp, { ISignUpResponse } from '../../../../api/controllers/signup';
import UserService from '../../../../api/services/UserService';
import UserMongoRepository from '../../../../database/mongodb/repository/UserRepository';
import UserSchema from '../../../../database/mongodb/models/user';
import logger from '../../../../logger';
import { ISuccessResponse } from '../../../../api/response/response';

let controller: SignUp;

describe('SignUp controller test (mongodb - repository, winston - logger)', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true
      });
      const repository = new UserMongoRepository(UserSchema);
      const service = new UserService({ repository, logger });
      controller = new SignUp(service);
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('SignUp: success case', async () => {
    const tempPassword: ISuccessResponse<
      ISignUpResponse
    > = await controller.signUp({
      password: 'test_password',
      email: 'test@test.test',
      role: 'client'
    });

    expect<string>(tempPassword.data.temp_password).toBeDefined();
    expect<string>(tempPassword.statusCode).toBe('OK');
  });

  test('SignUp: wrong case - Not valid email', async () => {
    await expect<Promise<ISuccessResponse<ISignUpResponse>>>(
      controller.signUp({
        password: 'test_password',
        email: 'test',
        role: 'client'
      })
    ).rejects.toThrow('Not valid email');
  });

  test('SignUp: wrong case - Email already exist', async () => {
    await expect<Promise<ISuccessResponse<ISignUpResponse>>>(
      controller.signUp({
        password: 'test_password',
        email: 'test@test.test',
        role: 'client'
      })
    ).rejects.toThrow('Email already exist');
  });
});
