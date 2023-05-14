import { createBot } from '@bot/bot';
import { config } from '@bot/config';
import { run } from '@grammyjs/runner';
import mongoose from 'mongoose';

const botInitialize = async () => {
  await mongoose.connect(config.MONGODB_URI);

  const bot = await createBot();

  run(bot);

  process.once('SIGINT', () => bot.stop());
  process.once('SIGTERM', () => bot.stop());
};

botInitialize();
