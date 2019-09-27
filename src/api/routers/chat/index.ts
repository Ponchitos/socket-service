import express from 'express';
import ChatService, { IChatReqCreate } from '../../services/ChatService';
import Chat from '../../models/Chat';

const router: express.Router = express.Router();

type ChatResponse = {
  name: string;
  user: string;
  chat: string;
  description: string;
  dateCreate: string;
}

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
      logger.info({ req, action: '/chats/create', data: body });

      const result: Chat = await services.chat.create(body);

      logger.info({ req, action: '/chats/create', result });

      res.json({
        statusCode: 'OK',
        data: {
          name: result.name,
          user: result.userUuid,
          chat: result.uuid,
          description: result.description,
          dateCreate: result.dateCreate.toISOString()
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
      logger.info({ req, action: '/chats/all' });
      const chats: Array<Chat> = await services.chat.findAll();

      logger.info({ req, action: '/chats/all', result: chats });

      res.json({
        statusCode: 'OK',
        data: chats.map<ChatResponse>((chat: Chat) => ({
          name: chat.name,
          user: chat.userUuid,
          chat: chat.uuid,
          description: chat.description,
          dateCreate: chat.dateCreate.toISOString()
        }))
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
      logger.info({ req, action: '/chats/' });
      const userUuid: string = req.params.user;
      const chats: Array<Chat> = await services.chat.findByUserUuid(userUuid);

      logger.info({ req, action: '/chats/', result: chats });

      res.json({
        statusCode: 'OK',
        data: chats.map<ChatResponse>((chat: Chat) => ({
          name: chat.name,
          user: chat.userUuid,
          chat: chat.uuid,
          description: chat.description,
          dateCreate: chat.dateCreate.toISOString()
        }))
      });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
    '/chat/',
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
      try {
        logger.info({ req, action: '/chats/chat' });
        const chatUuid: string = req.params.chat;
        const chat: Chat | null = await services.chat.findByUuid(chatUuid);

        logger.info({ req, action: '/chats/chat', result: chat });

        res.json({
          statusCode: 'OK',
          data: chat == null ? {} : {
            name: chat.name,
            user: chat.userUuid,
            chat: chat.uuid,
            description: chat.description,
            dateCreate: chat.dateCreate.toISOString()
          }
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
