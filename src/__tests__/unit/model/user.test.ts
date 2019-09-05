import User from '../../../api/models/User';

describe('User tests', () => {
  let user: User;

  beforeAll(() => {
    user = new User({
      email: 'test@test.com',
      role: 'client',
      password: 'test_password'
    });
  });

  test('check generateHashPassword', async () => {
    await user.generateHashPassword();

    expect<string>(user.passwordHash).not.toBe(null);
  });

  test('check comparePassword', async () => {
    const result: boolean = await user.comparePassword('test_password');
    const wrongResult: boolean = await user.comparePassword('password');

    expect<boolean>(result).toBe(true);
    expect<boolean>(wrongResult).toBe(false);
  });

  test('check generateTempPassword', () => {
    user.generateTempPassword();

    expect<string>(user.tempPassword).not.toBe(null);
    expect<number>(user.tempPassword.length).toBeGreaterThan(0);
  });
});
