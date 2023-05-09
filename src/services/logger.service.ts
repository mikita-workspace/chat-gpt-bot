import { addColors, createLogger, format, transports } from 'winston';

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'magenta',
    info: 'green',
    verbose: 'cyan',
    silly: 'grey',
  },
};

addColors(config.colors);

export const logger = createLogger({
  level: 'info',
  levels: config.levels,
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
      filename: `combined.log`,
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
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}
