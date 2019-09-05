import UserService from '../../services/UserService';
import User from '../../models/User';
import { ISuccessResponse } from '../../response/response';

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface ISignInResponse {
  uuid: string;
}

export default class SignIn {
  private _service: UserService;

  constructor(service: UserService) {
    this._service = service;
  }

  async singIn(
    body: ISignInRequest
  ): Promise<ISuccessResponse<ISignInResponse>> {
    const user: User | null = await this._service.findByEmail(body.email);

    if (user === null) {
      throw new Error('User not found');
    }

    const checkValidPassport = await user.comparePassword(body.password);
    if (!checkValidPassport) {
      throw new Error('Not valid login data');
    }

    return {
      statusCode: 'OK',
      data: {
        uuid: user.uuid
      }
    };
  }

  async auth(uuid: string): Promise<ISuccessResponse<boolean>> {
    const user: User | null = await this._service.findByUuid(uuid);

    if (user === null) {
      throw new Error('User not found');
    }

    return {
      statusCode: 'OK',
      data: true
    };
  }
}
