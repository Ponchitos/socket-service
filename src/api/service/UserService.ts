import IUserRepository from '../repositories/UserRepository';
import User from '../model/User';

export interface IUserService {
  repository: IUserRepository;
  logger: any;
}

export interface IUserReqCreate {
  email: string;
  password: string;
  role: string;
}

export default class UserService {
  private _repository: IUserRepository;
  private _logger: any;

  constructor(data: IUserService) {
    this._repository = data.repository;
    this._logger = data.logger;
  }

  async create(data: IUserReqCreate): Promise<User> {
    const user: User = new User({
      email: data.role,
      password: data.password,
      role: data.role
    });
    await user.generateHashPassword();
    await user.generateTempPassword();
    await this._repository.create(user);
    this._logger.info({
      action: 'user service: create',
      data,
      result: user.toString()
    });

    return user;
  }

  async findAll(): Promise<Array<User>> {
    const result: Array<User> = await this._repository.findAll();
    this._logger.info({ action: 'user service: find all', result });

    return result;
  }

  async findByUuid(uuid: string): Promise<User | null> {
    const result: User | null = await this._repository.findByUuid(uuid);
    this._logger.info({
      action: 'user service: find by uuid',
      data: uuid,
      result
    });

    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result: User | null = await this._repository.findByEmail(email);
    this._logger.info({
      action: 'user service: find by email',
      data: email,
      result
    });

    return result;
  }
}
