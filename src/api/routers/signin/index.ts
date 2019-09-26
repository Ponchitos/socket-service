import express from 'express';
import UserService from '../../services/UserService';
import User from '../../models/User';
import IAuthService from '../../../auth/interface';

interface ISignInRequest {
  email: string;
  password: string;
}

const router: express.Router = express.Router();

let services: {
  user: UserService;
  auth: IAuthService;
};

let logger: any;

router.post(
  '/signin',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const body: ISignInRequest = req.body as ISignInRequest;
      logger.info({ req, action: '/signin', data: body });

      const user: User | null = await services.user.findByEmail(body.email);
      if (user === null) {
        throw new Error('User not found');
      }

      const checkValidPassport = await user.comparePassword(body.password);
      if (!checkValidPassport) {
        throw new Error('Not valid login data');
      }

      res = services.auth.authCreate(res, user.uuid);

      if (user.role === 'client') {
        res.redirect('');
      }

      res.redirect('');
    } catch (e) {
      next(e);
    }
  }
);

export default (
  userService: UserService,
  authService: IAuthService,
  settings: any
): express.Router => {
  services = {
    user: userService,
    auth: authService
  };

  logger = settings;

  return router;
};
