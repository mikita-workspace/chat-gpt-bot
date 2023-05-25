import { inlineGoToAdminMenu } from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import { BotContextType } from '@bot/types';
import { removeFile } from '@bot/utils';

export const downloadLogsCallback = async (ctx: BotContextType) => {
  try {
    const loggerInfo = await mongo.getLoggerInfo();

    if (loggerInfo) {
      const { filePath, filePathForReply } = (await csv.createLoggerCsv(loggerInfo)) ?? {};

      if (filePath && filePathForReply) {
        await ctx.deleteMessage();
        await ctx.replyWithDocument(filePathForReply, {
          reply_markup: inlineGoToAdminMenu(ctx),
        });

        await removeFile(filePath);
      }
    }
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`callbacks::logs::downloadLogsCallback::${error.message}`);
  }
};