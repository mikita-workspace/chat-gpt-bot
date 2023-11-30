import { BotType } from '@bot/app/types';
import { getGptContent, gptLoader } from '@bot/common/helpers';
import { expiresInFormat, isExpiredDate } from '@bot/common/utils';
import { inlineFeedback } from '@bot/keyboards';
import { Logger } from '@bot/services';

export const textModule = (bot: BotType) => {
  bot.on('message:text', async (ctx) => {
    try {
      const messageId = Number(ctx.message?.message_id);
      const text = String(ctx.message?.text);
      const locale = await ctx.i18n.getLocale();

      const clientAccountLevel = ctx.session.client.accountLevel;

      if (
        clientAccountLevel &&
        !isExpiredDate(clientAccountLevel.expiresAt) &&
        !clientAccountLevel.gptTokens
      ) {
        return await ctx.reply(
          `${ctx.t('usage-token-limit', {
            expiresIn: expiresInFormat(clientAccountLevel.expiresAt, locale),
          })} ${ctx.t('support-contact')}`,
          { reply_to_message_id: messageId },
        );
      }

      const message = await gptLoader(ctx, messageId);

      if (!text) {
        return await message.editText(ctx.t('error-message-gpt'), {
          reply_to_message_id: messageId,
        });
      }

      const gptContent = await getGptContent(ctx, text);

      await message.delete();

      if (gptContent) {
        return await ctx.reply(gptContent, {
          parse_mode: 'Markdown',
          reply_markup: inlineFeedback(ctx),
          reply_to_message_id: messageId,
        });
      }

      return await ctx.reply(ctx.t('error-message-gpt'), {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.reply(ctx.t('error-message-common'));

      Logger.error({
        context: 'src/modules/text/text.module.ts::textModule',
        message: error.message,
        stack: JSON.stringify(error),
      });
    }
  });
};
