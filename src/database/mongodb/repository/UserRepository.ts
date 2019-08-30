import { Model } from 'mongoose';

import User from '../../../api/model/User';
import { IUser } from '../models/user';
import IUserRepository from '../../../api/repositories/UserRepository';

export default class UserMongoRepository implements IUserRepository {
  private _model: Model<IUser>;

  constructor(userModel: Model<IUser>) {
    this._model = userModel;
  }

  async create(user: User): Promise<User> {
    await this._model.create({
      uuid: user.uuid,
      email: user.email,
      passwordHash: user.passwordHash,
      passwordSalt: user.passwordSalt,
      tempPassword: user.tempPassword,
      role: user.role
    });
    return user;
  }

  async findAll(): Promise<Array<User>> {
    const dbResult: Array<IUser> = await this._model.find();
    return dbResult.map<User>(
      user =>
        new User({
          email: user.email,
          passwordSalt: user.passwordSalt,
          passwordHash: user.passwordHash,
          tempPassword: user.tempPassword,
          uuid: user.uuid,
          role: user.role
        })
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const dbResult: IUser | null = await this._model.findOne({ email });
    if (dbResult != null)
      return new User({
        email: dbResult.email,
        passwordSalt: dbResult.passwordSalt,
        passwordHash: dbResult.passwordHash,
        tempPassword: dbResult.tempPassword,
        uuid: dbResult.uuid,
        role: dbResult.role
      });
    return null;
  }

  async findByUuid(uuid: string): Promise<User | null> {
    const dbResult: IUser | null = await this._model.findOne({ uuid });
    if (dbResult != null)
      return new User({
        email: dbResult.email,
        passwordSalt: dbResult.passwordSalt,
        passwordHash: dbResult.passwordHash,
        tempPassword: dbResult.tempPassword,
        uuid: dbResult.uuid,
        role: dbResult.role
      });
    return null;
  }
}
