import Winston from 'winston';

const logger: Winston.Logger = Winston.createLogger({
  level: 'info',
  format: Winston.format.combine(
    Winston.format.splat(),
    Winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    Winston.format.errors({ stack: true }),
    Winston.format.json()
  ),
  defaultMeta: { service: 'socket service' },
  transports: [
    new Winston.transports.File({
      filename: './logs/info.log',
      level: 'info'
    }),
    new Winston.transports.File({
      filename: './logs/errors.log',
      level: 'error'
    })
  ]
});

export default logger;
