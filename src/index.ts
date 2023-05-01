import mongoose from 'mongoose';
import { config } from './config';
import { createBot } from './bot';

const botInitialize = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);

    const bot = createBot();

    bot.start();

    console.info('bot started');

    process.once('SIGINT', () => bot.stop());
    process.once('SIGTERM', () => bot.stop());
  } catch (error) {
    console.error(`ERROR::botInitialize::${(error as Error).message}`);
  }
};

botInitialize();
