import mongoose from 'mongoose';
import { BotError, GrammyError, HttpError } from 'grammy';
import { config } from './config';
import { createBot } from './bot';

const handleBotError = (error: BotError) => {
  const ctx = error.ctx;
  const err = error.error;

  console.error(`Error while handling update ${ctx.update.update_id}:`);

  if (err instanceof GrammyError) {
    console.error('Error in request:', err.description);
  } else if (err instanceof HttpError) {
    console.error('Could not contact Telegram:', err);
  } else {
    console.error('Unknown error:', err);
  }
};

const botInitialize = async () => {
  await mongoose.connect(config.MONGODB_URI);

  const bot = createBot();

  bot.start();

  bot.catch(handleBotError);

  process.once('SIGINT', () => bot.stop());
  process.once('SIGTERM', () => bot.stop());
};

botInitialize();
