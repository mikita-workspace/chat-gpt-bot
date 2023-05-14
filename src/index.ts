import { createBot } from '@bot/bot';
import { config } from '@bot/config';
import mongoose from 'mongoose';

const botInitialize = async () => {
  await mongoose.connect(config.MONGODB_URI);

  const bot = await createBot();

  bot.start();

  process.once('SIGINT', () => bot.stop());
  process.once('SIGTERM', () => bot.stop());
};

botInitialize();
