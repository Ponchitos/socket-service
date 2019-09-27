import express from 'express';

export interface ICheckAuthResponse {
  uuid: string | null;
  auth: boolean;
}

export type AuthCreateType = { token: string, exp: string }

export default interface IAuthService {
  authCreate(uuid: string): AuthCreateType;
  checkAuth(res: express.Request): Promise<ICheckAuthResponse>;
}
