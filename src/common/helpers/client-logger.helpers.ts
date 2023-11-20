import { Logger } from '@bot/services';
import { BotError, GrammyError, HttpError } from 'grammy';

import { WEBHOOK_TIMEOUT } from '../constants';

export const handleBotError = (error: BotError) => {
  const ctx = error.ctx;
  const err = error.error;

  Logger.error({
    context: 'src/common/helpers/client-logger.helpers.ts',
    message: `handleBotError::error while handling update::${ctx.update.update_id}:`,
    stack: JSON.stringify(error),
  });

  if (err instanceof GrammyError) {
    Logger.error({
      context: 'src/common/helpers/client-logger.helpers.ts',
      message: `handleBotError::error in request::${err.description}`,
      stack: JSON.stringify(error),
    });
  } else if (err instanceof HttpError) {
    Logger.error({
      context: 'src/common/helpers/client-logger.helpers.ts',
      message: `handleBotError::could not contact Telegram::${err.message}`,
      stack: JSON.stringify(error),
    });
  } else {
    Logger.error({
      context: 'src/common/helpers/client-logger.helpers.ts',
      message: `handleBotError::unknown error::${error.message}`,
      stack: JSON.stringify(error),
    });
  }
};

export const handleTimeoutError = () => {
  Logger.error({
    context: 'src/common/helpers/client-logger.helpers.ts',
    message: `handleTimeoutError::error::Webhook timeout (${WEBHOOK_TIMEOUT}) has been reached`,
    stack: '',
  });

  return;
};
