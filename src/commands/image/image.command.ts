import { BotCommands } from '@bot/constants';
import { createImageConversation } from '@bot/conversations';
import { mongo } from '@bot/services';
import { BotType } from '@bot/types';
import { getTimezoneString } from '@bot/utils';

export const imageCommand = (bot: BotType) =>
  bot.command(BotCommands.IMAGE, async (ctx) => {
    const username = String(ctx?.from?.username);

    const usedGptImages = ctx.session.limit.amountOfGptImages;
    const currentLocale = await ctx.i18n.getLocale();

    const user = await mongo.getUser(username);

    if (user && usedGptImages >= user.limit.gptImages) {
      const limitDate = new Date(user.limit.expire);

      await ctx.reply(
        ctx.t('info-message-reach-gpt-images-limit', {
          date: limitDate.toLocaleString(currentLocale),
          utc: getTimezoneString(limitDate.getTimezoneOffset()),
        }),
      );

      return;
    }

    await ctx.conversation.enter(createImageConversation.name);
  });
