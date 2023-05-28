import {
  createLogger,
  format,
  transports
} from 'winston';
import ConsoleLoggerTransport from './lib/log';

const logTransports: any[] = [
  new transports.File({
    level: 'error',
    filename: './logs/error.log',
    format: format.json({
      replacer: (key: string, value: any) => {
        if (key === 'error') {
          return {
            message: (value as Error).message,
            stack: (value as Error).stack
          };
        }
        return value;
      }
    })
  }),
  new ConsoleLoggerTransport()
];

const logger = createLogger({
  format: format.combine(
    format.timestamp()
  ),
  transports: logTransports,
  defaultMeta: { service: 'api' },
  level: process.env.NODE_ENV === 'development' ? 'silly' : 'info'
});

export default logger;
