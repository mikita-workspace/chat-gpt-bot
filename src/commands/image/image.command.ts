import { BotCommands } from '@bot/constants';
import { inlineGoToChat } from '@bot/keyboards';
import { openAI } from '@bot/services';
import { BotType } from '@bot/types';

export const imageCommand = (bot: BotType) =>
  bot.command(BotCommands.IMAGE, async (ctx) => {
    // ctx.reply(ctx.t('description-message'), { reply_markup: inlineGoToChat(ctx) }),
    // await ctx.replyWithPhoto()
    const t = await openAI.generateImage('red', 2);
    await openAI.convertGptImages(t.map((t) => t.b64_json ?? ''));

    console.log(t);
  });
