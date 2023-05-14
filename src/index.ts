import { createBot } from '@bot/bot';
import { config } from '@bot/config';
import { logger } from '@bot/services';
import { BotError, GrammyError, HttpError } from 'grammy';
import mongoose from 'mongoose';

const handleBotError = (error: BotError) => {
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

const botInitialize = async () => {
  await mongoose.connect(config.MONGODB_URI);

  const bot = await createBot();

  bot.start();

  bot.catch(handleBotError);

  process.once('SIGINT', () => bot.stop());
  process.once('SIGTERM', () => bot.stop());
};

botInitialize();
