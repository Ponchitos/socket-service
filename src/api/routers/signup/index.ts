import express from 'express';
import UserService from '../../services/UserService';
import User from '../../models/User';

interface ISignUpRequest {
  email: string;
  password: string;
  role: string;
}

const router: express.Router = express.Router();

let services: {
  user: UserService;
};

let logger: any;

const validationEmail = (email: string): boolean => {
  const re: RegExp = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@(?<domain>((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\d-A-Za-z]+\.)+[A-Za-z]{2,})))$/;

  return re.test(email);
};

router.post(
  '/signup',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const body: ISignUpRequest = req.body as ISignUpRequest;
      logger.info({ req, action: '/signup', data: body });

      if (!validationEmail(body.email)) {
        throw new Error('Not valid email');
      }

      const user: User | null = await services.user.findByEmail(body.email);
      if (user != null) {
        throw new Error('Email already exist');
      }

      const result: User = await services.user.create(body);

      res.json({
        statusCode: 'OK',
        data: {
          temp_password: result.tempPassword
        }
      });
    } catch (e) {
      next(e);
    }
  }
);

export default (userService: UserService, settings: any): express.Router => {
  services = {
    user: userService
  };

  logger = settings;

  return router;
};
