import { LoggerInfoCsvIds } from '@bot/constants';
import { logger } from '@bot/services';
import { BotLoggerModelType } from '@bot/types';
import { getTimestampUnix } from '@bot/utils';
import { BotError, GrammyError, HttpError } from 'grammy';

export const handleBotError = (error: BotError) => {
  const ctx = error.ctx;
  const err = error.error;

  logger.error(`handleBotError::error while handling update::${ctx.update.update_id}:`);

  if (err instanceof GrammyError) {
    logger.error(`handleBotError::error in request::${err.description}`);
  } else if (err instanceof HttpError) {
    logger.error(`handleBotError::could not contact Telegram::${err.message}`);
  } else {
    logger.error(`handleBotError::unknown error::${error.message}`);
  }
};

export const mapBotLoggerInfo = (botLoggerInfo: BotLoggerModelType[]) =>
  botLoggerInfo.map(({ timestamp, level, message, meta: { username } }) => ({
    [LoggerInfoCsvIds.TIMESTAMP]: getTimestampUnix(timestamp),
    [LoggerInfoCsvIds.LEVEL]: level,
    [LoggerInfoCsvIds.USERNAME]: username,
    [LoggerInfoCsvIds.MESSAGE]: message,
  }));

export const handleTimeoutError = () => {
  logger.error(`handleTimeoutError::error::Webhook timeout has been reached`);

  return;
};
