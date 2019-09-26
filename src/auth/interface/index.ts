import express from 'express';

export interface ICheckAuthResponse {
  uuid: string | null;
  auth: boolean;
}

export default interface IAuthService {
  authCreate(req: express.Response, uuid: string): express.Response;
  checkAuth(res: express.Request): Promise<ICheckAuthResponse>;
}
