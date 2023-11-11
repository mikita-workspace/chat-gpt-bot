import 'winston-mongodb';

import { winstonConfig } from '@bot/common/constants';
import { getTimestampUnix } from '@bot/common/utils';
// import { config } from '@bot/config';
// import { ClientLoggerModel } from '@bot/models';
import { addColors, createLogger, format, Logger, transports } from 'winston';

class LoggerService {
  logger: Logger;

  constructor() {
    addColors(winstonConfig.colors);

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
      transports: [
        new transports.File({
          filename: 'errors.log',
          level: 'error',
          format: format.printf(
            (info) =>
              `${getTimestampUnix(info.timestamp)} ${info.level.toLocaleUpperCase()}: ${
                info.message
              }`,
          ),
        }),
        new transports.File({
          filename: 'combined.log',
          level: 'silly',
          format: format.printf(
            (info) =>
              `${getTimestampUnix(info.timestamp)} ${info.level.toLocaleUpperCase()}: ${
                info.message
              }`,
          ),
        }),
      ],
    });

    // TODO: Temporary disabled
    // NOTE: Logger with mongoDB does not work on test environment for unit testing
    // if (process.env.NODE_ENV !== 'test') {
    //   this.logger.add(
    //     new transports.MongoDB({
    //       collection: ClientLoggerModel.collection.name,
    //       db: config.MONGODB_URI,
    //       format: format.metadata(),
    //       options: {
    //         useUnifiedTopology: true,
    //       },
    //     }),
    //   );
    // }

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
