import { inlineGoToAdminMenu } from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import { BotContextType } from '@bot/types';
import { removeFile } from '@bot/utils';

export const downloadBotLoggerCallback = async (ctx: BotContextType) => {
  try {
    const loggerInfo = await mongo.getBotLoggerInfo();

    if (loggerInfo) {
      const { filePath, filePathForReply } = await csv.createBotLoggerCsv(loggerInfo);

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

    logger.error(`callbacks::bot-logger::downloadLoggerCallback::${JSON.stringify(error.message)}`);
  }
};
