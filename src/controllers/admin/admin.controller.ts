import { BotType } from '../../types';
import { mongo } from '../../services';
import { getHtmlForSessionMessages } from '../../helpers';

export const adminController = async (bot: BotType) =>
  bot.command('admin', async (ctx) => {
    const msg = await mongo.getUserSessionMessages('495000805');

    console.log(getHtmlForSessionMessages());

    await ctx.api.sendMessage(
      ctx.chat.id,
      getHtmlForSessionMessages(msg, 'error'),
      {
        parse_mode: 'HTML',
      },
    );
  });
