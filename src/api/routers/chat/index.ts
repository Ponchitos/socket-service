import express from 'express';
import ChatService, { IChatReqCreate } from '../../services/ChatService';
import Chat from '../../models/Chat';

const router: express.Router = express.Router();

let services: {
  chat: ChatService;
};

let logger: any;

router.post(
  '/create',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const body: IChatReqCreate = req.body as IChatReqCreate;
      logger.info({ req, action: '/chat/create', data: body });

      const result: Chat = await services.chat.create(body);

      res.json({
        statusCode: 'OK',
        data: {
          name: result.name,
          user: result.userUuid,
          chat: result.uuid,
          description: result.description,
          dateCreate: result.dateCreate
        }
      });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/all',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      logger.info({ req, action: '/chat/all' });
      const result: Array<Chat> = await services.chat.findAll();

      res.json({
        statusCode: 'OK',
        data: result
      });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      logger.info({ req, action: '/chat' });
      const userUuid: string | undefined = req.params.user;
      const chatUuid: string | undefined = req.params.chat;

      let result: Array<Chat> | Chat | null = null;

      if (userUuid != null) {
        result = await services.chat.findByUserUuid(userUuid);
      } else if (chatUuid != null) {
        result = await services.chat.findByUuid(chatUuid);
      }

      res.json({
        statusCode: 'OK',
        data: result
      });
    } catch (e) {
      next(e);
    }
  }
);

export default (chatService: ChatService, settings: any): express.Router => {
  services = {
    chat: chatService
  };

  logger = settings;

  return router;
};
