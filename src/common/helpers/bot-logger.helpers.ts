import { Logger } from '@bot/services';
import { BotError, GrammyError, HttpError } from 'grammy';

export const handleBotError = (error: BotError) => {
  const ctx = error.ctx;
  const err = error.error;

  Logger.error(`handleBotError::error while handling update::${ctx.update.update_id}:`);

  if (err instanceof GrammyError) {
    Logger.error(`handleBotError::error in request::${err.description}`);
  } else if (err instanceof HttpError) {
    Logger.error(`handleBotError::could not contact Telegram::${err.message}`);
  } else {
    Logger.error(`handleBotError::unknown error::${error.message}`);
  }
};

export const handleTimeoutError = () => {
  Logger.error(`handleTimeoutError::error::Webhook timeout has been reached`);

  return;
};
