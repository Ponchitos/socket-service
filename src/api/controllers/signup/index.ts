import UserService from '../../services/UserService';
import User from '../../models/User';
import { ISuccessResponse } from '../../response/response';

export interface ISignUpRequest {
  email: string;
  password: string;
  role: string;
}

export interface ISignUpResponse {
  temp_password: string;
}

export default class SignUp {
  private _service: UserService;

  constructor(service: UserService) {
    this._service = service;
  }

  private static validEmail(email: string): boolean {
    const re: RegExp = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@(?<domain>((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\d-A-Za-z]+\.)+[A-Za-z]{2,})))$/;

    return re.test(email);
  }

  async signUp(
    body: ISignUpRequest
  ): Promise<ISuccessResponse<ISignUpResponse>> {
    if (!SignUp.validEmail(body.email)) {
      throw new Error('Not valid email');
    }

    const user: User | null = await this._service.findByEmail(body.email);
    if (user != null) {
      throw new Error('Email already exist');
    }

    const result: User = await this._service.create(body);

    return {
      statusCode: 'OK',
      data: {
        temp_password: result.tempPassword
      }
    };
  }
}
