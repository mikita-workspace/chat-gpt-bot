import { resolve as resolvePath } from 'path';
import { adminInlineGoToMainMenu } from '../../menu';
import { logger } from '../../services';
import { BotContextType } from '../../types';
import { InputFile } from 'grammy';

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
