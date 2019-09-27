import * as jwt from 'jsonwebtoken';
import express from 'express';
import IUserRepository from '../../api/repositories/UserRepository';
import IAuthService, {AuthCreateType, ICheckAuthResponse} from '../interface';
import User from '../../api/models/User';

export interface IConfing {
  secret: string;
  expiresIn: string;
}

export interface Interface {
  Authorization?: string;
}

export default class AuthJWTService implements IAuthService {
  private _repository: IUserRepository;
  private _config: IConfing;

  constructor(repository: IUserRepository, config: IConfing) {
    this._repository = repository;
    this._config = config;
  }

  authCreate(uuid: string): AuthCreateType {
    const token: string = jwt.sign({ uuid }, this._config.secret, {
      expiresIn: this._config.expiresIn
    });

    const exp: string = this._config.expiresIn;

    return {
      token,
      exp
    };
  }

  async checkAuth(req: express.Request): Promise<ICheckAuthResponse> {
    const cookies: Interface = req.cookies;
    if (!cookies) {
      return {
        uuid: null,
        auth: false
      };
    }

    if (!cookies.Authorization) {
      return {
        uuid: null,
        auth: false
      };
    }

    const data: { uuid: string } = jwt.verify(
      cookies.Authorization,
      this._config.secret
    ) as { uuid: string };
    const check: User | null = await this._repository.findByUuid(data.uuid);

    if (check === null) {
      return {
        uuid: null,
        auth: false
      };
    }
    return {
      uuid: data.uuid,
      auth: true
    };
  }
}
