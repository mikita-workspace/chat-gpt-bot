import { winstonConfig } from '@bot/common/constants';
import { config } from '@bot/config';
import { addColors, createLogger, format, Logger, transports } from 'winston';
import SlackHook from 'winston-slack-webhook-transport';

import { apiErrorPayload } from './payloads';

class LoggerService {
  logger: Logger;

  constructor() {
    addColors(winstonConfig.colors);

    const customFormat = format.printf((info) => {
      const { timestamp, level, message, ...args } = info;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${
        Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
      }`;
    });

    const options = {
      file: {
        filename: 'error.log',
        level: 'error',
      },
      console: {
        level: 'info',
      },
    };

    // For Development environment
    const devLogger = {
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.errors({ stack: true }),
        customFormat,
      ),
      transports: [new transports.Console(options.console)],
    };

    // For Production environments
    const prodLogger = {
      format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
      transports: [
        new transports.File(options.file),
        new transports.File({
          filename: 'combine.log',
          level: 'info',
        }),
        new SlackHook({
          level: 'error',
          webhookUrl: config.SLACK_WEBHOOK,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (error: any) => apiErrorPayload(error),
        }),
      ],
    };

    this.logger = createLogger(process.env.NODE_ENV === 'production' ? prodLogger : devLogger);
  }
}

export const { logger } = new LoggerService();
