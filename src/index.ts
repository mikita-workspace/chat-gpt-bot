import { createBot } from '@bot/app';
import { WEBHOOK_TIMEOUT } from '@bot/common/constants';
import { handleTimeoutError } from '@bot/common/helpers';
import { config } from '@bot/config';
import { run } from '@grammyjs/runner';
import express from 'express';
import { webhookCallback } from 'grammy';
import mongoose from 'mongoose';

const botInitialize = async () => {
  await mongoose.connect(config.MONGODB_URI);

  const bot = createBot();

  if (process.env.NODE_ENV === 'production') {
    // Use Webhooks for the production server
    // Source: https://grammy.dev/guide/deployment-types.html#long-polling-vs-webhooks
    const app = express();

    app.use(express.json());
    app.use(webhookCallback(bot, 'express', handleTimeoutError, WEBHOOK_TIMEOUT));

    app.listen(config.PORT, () => {
      // eslint-disable-next-line no-console
      console.info(`Bot listening on port ${config.PORT}`);
    });
  } else {
    // Use Long Polling for development
    run(bot);
  }

  process.once('SIGINT', () => bot.stop());
  process.once('SIGTERM', () => bot.stop());
};

botInitialize();
