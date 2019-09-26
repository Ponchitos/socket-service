import express from 'express';
import mongoose from 'mongoose';
import ajv from 'ajv';
import bodyParser from "body-parser";
import helmet from "helmet";
import responseTime from 'response-time';
import debug from 'debug';
import socket from 'socket.io';

import logger from './logger/winston';

import SocketIOService from './socket/socket.io';

import ActiveRooms from './common/room-store';

import UserSchema from './database/mongodb/models/user';
import ChatSchema from './database/mongodb/models/chat';
import MessageSchema from './database/mongodb/models/message';

import UserMongoRepository from "./database/mongodb/repository/UserRepository";
import ChatMongoRepository from "./database/mongodb/repository/ChatRepository";
import MessageMongoRepository from "./database/mongodb/repository/MessageRepository";

import UserService from "./api/services/UserService";
import MessageService from "./api/services/MessageService";
import ChatService from "./api/services/ChatService";

import AuthJWTService from './auth/jwt';

import ajvCompiler, {ISchemaValidators} from './common/ajv';

import config from './config';

const ENVIRONMENT: 'test' | 'stage' | 'prod' = process.env.NODE_ENV as 'test' | 'stage' | 'prod' || 'test';

const APP_PORT: string = process.env.APP_PORT || config[ENVIRONMENT].server.port;
const MONGODB_URL: string = process.env.MONGODB_URL || config[ENVIRONMENT].mongodb.uri;
const MONGODB_PORT: string = process.env.MONGODB_PORT || config[ENVIRONMENT].mongodb.port;
const MONGODB_DB: string = process.env.MONGODB_DB || config[ENVIRONMENT].mongodb.db;

config[ENVIRONMENT].jwt.secret = process.env.JWT_SECRET || config[ENVIRONMENT].jwt.secret;
config[ENVIRONMENT].jwt.expiresIn = process.env.JWT_EXPIRES != null ? parseInt(process.env.JWT_EXPIRES) : config[ENVIRONMENT].jwt.expiresIn;

const debugFatal: debug.Debugger = debug('FATAL');
const ajvExample: ajv.Ajv = ajv({ allErrors: true });

interface ISchema {
    api: object;
    chat: object;
}

const schemas: ISchema = {
    api: require('./api/schemas/api.schema.json'),
    chat: require('./api/schemas/chat.schema.json')
};

const schemaValidator: ISchemaValidators = ajvCompiler(ajvExample, schemas, 3);

const dbString: string = `mongodb://${MONGODB_URL}:${MONGODB_PORT}/${MONGODB_DB}`;

mongoose.connect(dbString, {
    useNewUrlParser: true
});

const repositories = {
    user: new UserMongoRepository(UserSchema),
    chat: new ChatMongoRepository(ChatSchema),
    message: new MessageMongoRepository(MessageSchema)
};

const services = {
    user: new UserService({
        logger,
        repository: repositories.user
    }),
    chat: new ChatService({
        logger,
        repository: repositories.chat
    }),
    message: new MessageService({
        logger,
        repository: repositories.message
    }),
    auth: new AuthJWTService(repositories.user, config[ENVIRONMENT].jwt),
};

const socketService = new SocketIOService(services.message);
const socketActiveRooms = new ActiveRooms();

const application: express.Express = express();

application.use(helmet());
application.use(bodyParser.raw());
application.use(bodyParser.json());
application.use(responseTime());

application.use(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const [controller, action] = req.url.split('/').slice(1, 3);

    // validate request with ajv
    // @ts-ignore
    if (schemaValidator[controller] && schemaValidator[controller][req.method] && schemaValidator[controller][req.method][action]) {
        // @ts-ignore
        const validateRequest = schemaValidator[controller][req.method][action].request;
        // @ts-ignore
        const validateParams = schemaValidator[controller][req.method][action].params;
        if (validateRequest != null && !validateRequest(req.body)) {
            next(new Error('Not valid request'));
            return;
        }

        if (validateParams != null && !validateParams(req.query)) {
            next(new Error('Not valid request'));
            return;
        }
    }
    next();
});

application.use('/api/',
    require('./api/routers/signup')(services.user, logger));

application.use('/api/',
    require('./api/routers/signin')(services.user, services.auth, logger));

application.use(services.auth.checkAuth);

application.use('/chat/',
    require('./api/routers/chat')(services.chat, logger));

application.use(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    logger.error({ url: req.url, method: req.method, code: 404 });
    res.status(404).json({ status: "ERROR", data: { code: 404, message: 'NOT_FOUND' } });
});

application.use((err: Error, req: express.Request | null, res: express.Response | null, next: express.NextFunction | null): boolean => {
    logger.error({
        url: req != null ? req.url : "",
        method: req != null ? req.method : "",
        body: req != null ? req.body : {},
        code: 500,
        message: err.message,
        err
    });

    if (res != null) {
        res.status( 500).json({
            status: "ERROR",
            data: {
                code: 500,
                message: err.message
            }
        });
    }
    return true;
});

application.listen(APP_PORT, async (): Promise<void> => {
    logger.info(`[${ENVIRONMENT}] listening on port ${APP_PORT}`)
});

const io: socket.Server = socket(application);

io.on('connection', (socket: socket.Socket) => {
    socketService.client(socket, socketActiveRooms);
    socketService.support(socket, socketActiveRooms);
});

process.on('uncaughtException', (err: Error) => {
    debugFatal('uncaughtException', err);
    mongoose.disconnect();
    logger.error({ event: 'uncaughtException', err });
});

// graceful shutdown
process.on('SIGINT', () => {
    debugFatal('SIGINT');
    mongoose.disconnect();
    logger.error({ event: 'SIGINT' });
    process.exit(1);
});











