import { adminInlineGoToMainMenu } from '@bot/menu';
import { logger } from '@bot/services';
import { BotContextType } from '@bot/types';
import { InputFile } from 'grammy';
import { resolve as resolvePath } from 'path';

export const downloadLogsCallback = async (filename: string, ctx: BotContextType) => {
  try {
    if (filename) {
      const filePath = resolvePath(__dirname, '../../../', `${filename}.log`);

      await ctx.deleteMessage();
      await ctx.replyWithDocument(new InputFile(filePath), {
        reply_markup: adminInlineGoToMainMenu(ctx),
      });
    }
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));

    logger.error(`callbacks::logs::downloadLogsCallback::${(error as Error).message}`);
  }
};
