import User from '../models/User';

export default interface IUserRepository {
  findAll(): Promise<Array<User>>;
  findByUuid(uuid: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
