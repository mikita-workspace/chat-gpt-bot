import 'winston-mongodb';

import { config } from '@bot/config';
import { winstonConfig } from '@bot/constants';
import { addColors, createLogger, format, Logger, transports } from 'winston';

addColors(winstonConfig.colors);

class LoggerService {
  logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      levels: winstonConfig.levels,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      defaultMeta: { service: 'gpt-bot-logger' },
      transports: [
        new transports.File({
          filename: 'errors.log',
          level: 'error',
          format: format.printf(
            (info) =>
              `${new Date(info.timestamp).toLocaleDateString('tr-Tr', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })} ${info.level.toLocaleUpperCase()}: ${info.message}`,
          ),
        }),
        new transports.File({
          filename: 'combined.log',
          level: 'silly',
          format: format.printf(
            (info) =>
              `${new Date(info.timestamp).toLocaleDateString('tr-Tr', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })} ${info.level.toLocaleUpperCase()}: ${info.message}`,
          ),
        }),
        new transports.MongoDB({
          db: config.MONGODB_URI,
          collection: 'loggers',
          options: {
            useUnifiedTopology: true,
          },
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      );
    }
  }
}

export const { logger } = new LoggerService();
