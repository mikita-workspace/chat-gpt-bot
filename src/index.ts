import { createBot } from '@bot/bot';
import { config } from '@bot/config';
import { botName, WEBHOOK_TIMEOUT } from '@bot/constants';
import { run } from '@grammyjs/runner';
import express from 'express';
import { webhookCallback } from 'grammy';
import mongoose from 'mongoose';

const botInitialize = async () => {
  await mongoose.connect(config.MONGODB_URI);

  const bot = createBot();

  if (process.env.NODE_ENV === 'production') {
    // Use Webhooks for the production server
    const app = express();

    app.use(express.json());
    app.use(webhookCallback(bot, 'express', 'return', WEBHOOK_TIMEOUT));

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.info(`${botName} listening on port ${PORT}`);
    });
  } else {
    // Use Long Polling for development
    run(bot);
  }

  process.once('SIGINT', () => bot.stop());
  process.once('SIGTERM', () => bot.stop());
};

botInitialize();
