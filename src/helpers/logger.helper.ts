import { LoggerInfoCsvIds } from '@bot/constants';
import { logger } from '@bot/services';
import { LoggerModelType } from '@bot/types';
import { BotError, GrammyError, HttpError } from 'grammy';

export const handleBotError = (error: BotError) => {
  const ctx = error.ctx;
  const err = error.error;

  logger.error(`botInitialize::error while handling update::${ctx.update.update_id}:`);

  if (err instanceof GrammyError) {
    logger.error(`botInitialize::error in request::${err.description}`);
  } else if (err instanceof HttpError) {
    logger.error(`botInitialize::could not contact Telegram::${err.message}`);
  } else {
    logger.error(`botInitialize::unknown error::${(err as Error).message}`);
  }
};

export const mapLoggerInfo = (loggerInfo: LoggerModelType[]) =>
  loggerInfo.map(({ timestamp, level, message }) => ({
    [LoggerInfoCsvIds.TIMESTAMP]: timestamp,
    [LoggerInfoCsvIds.LEVEL]: level,
    [LoggerInfoCsvIds.MESSAGE]: message,
  }));
