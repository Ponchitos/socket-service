import * as bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';

export interface IUserModel {
  email: string;
  role: string;
  password?: string;
  uuid?: string;
  passwordHash?: string;
  passwordSalt?: string;
  tempPassword?: string;
}

export default class User {
  private _email: string;
  private _role: string;
  private _passwordHash: string;
  private _passwordSalt: string;
  private _tempPassword: string;
  private _uuid: string;
  private _password: string;

  constructor(data: IUserModel) {
    this._email = data.email;
    this._role = data.role;
    this._uuid = data.uuid || uuidv4();
    this._passwordHash = data.passwordHash || '';
    this._passwordSalt = data.passwordSalt || '';
    this._tempPassword = data.tempPassword || '';
    this._password = data.password || '';
  }

  get email(): string {
    return this._email;
  }

  get role(): string {
    return this._role;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get passwordSalt(): string {
    return this._passwordSalt;
  }

  get tempPassword(): string {
    return this._tempPassword;
  }

  get uuid(): string {
    return this._uuid;
  }

  async generateHashPassword() {
    this._passwordSalt = await bcrypt.genSalt(10);
    this._passwordHash = await bcrypt.hash(this._password, this._passwordSalt);
  }

  comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this._passwordHash);
  }

  generateTempPassword() {
    this._tempPassword = Math.random()
      .toString(36)
      .slice(-8);
  }

  toString(): string {
    return JSON.stringify({
      email: this.email,
      uuid: this.uuid,
      role: this.role
    });
  }
}
