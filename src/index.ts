import mongoose from 'mongoose';
import { createBot } from './bot';
import { MONGODB_URI, MONGODB_URI_LOCAL } from './constants';

const botInitialize = async () => {
  try {
    const db = await mongoose.connect(
      process.env.NODE_ENV === 'production' ? MONGODB_URI : MONGODB_URI_LOCAL,
    );

    const bot = createBot(db);

    bot.start();

    process.once('SIGINT', () => bot.stop());
    process.once('SIGTERM', () => bot.stop());
  } catch (error) {
    console.error(`ERROR::botInitialize::${(error as Error).message}`);
  }
};

botInitialize();
