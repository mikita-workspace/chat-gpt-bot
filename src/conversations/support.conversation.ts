import { getClientAvailability } from '@bot/api/clients';
import { createCsmIssue, getCsmTopics } from '@bot/api/csm';
import { BotCommand } from '@bot/common/constants';
import { getMessageByAvailableLocale } from '@bot/common/utils';
import { supportKeyboard } from '@bot/keyboards';
import { Logger } from '@bot/services';

import { ConversationType } from './types';

export const supportConversation: ConversationType = async (conversation, ctx) => {
  try {
    const telegramId = Number(ctx?.from?.id);
    const messageId = Number(ctx.message?.message_id);
    const locale = await conversation.external(() => ctx.i18n.getLocale());

    const availability = await conversation.external(() => getClientAvailability(telegramId));
    const isAuth = availability
      ? availability.state.isApproved || availability.state.isBlocked
      : false;

    const topics = (await conversation.external(() => getCsmTopics(telegramId))).filter(
      (topic) => topic.isPrivate === isAuth,
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const otherTopic = topics.find(({ key }) => key === 'other')!;

    const inlineTopics = [
      ...topics
        .reduce<string[]>((acc, { name, key }) => {
          if (key !== 'other') {
            acc.push(getMessageByAvailableLocale(name, locale));
          }

          return acc;
        }, [])
        .sort(),
      getMessageByAvailableLocale(otherTopic.name, locale),
    ];

    if (!inlineTopics.length) {
      return await ctx.reply(ctx.t('error-message-common'), { reply_to_message_id: messageId });
    }

    await ctx.reply(ctx.t('support-select-topic'), {
      reply_markup: supportKeyboard(inlineTopics),
    });

    const {
      message: { text: topic },
    } = await conversation.waitFor('message:text');

    if (Object.values(BotCommand).includes(topic.slice(1) as BotCommand)) {
      return await ctx.reply(ctx.t('support-error', { command: topic }), {
        reply_markup: { remove_keyboard: true },
      });
    }

    await ctx.reply(ctx.t('support-enter-description'), {
      reply_markup: { remove_keyboard: true },
    });

    const {
      message: { text: description },
    } = await conversation.waitFor('message:text');

    if (Object.values(BotCommand).includes(description.slice(1) as BotCommand)) {
      return await ctx.reply(ctx.t('support-error', { command: description }), {
        reply_markup: { remove_keyboard: true },
      });
    }

    const selectedKey = topics.find(
      ({ name }) => getMessageByAvailableLocale(name, locale) === topic,
    )?.key;

    if (selectedKey) {
      const newCsmIssue = await conversation.external(() =>
        createCsmIssue(telegramId, selectedKey, description),
      );

      return await ctx.reply(
        ctx.t('support-success', {
          csm: `<b>${newCsmIssue?.ticketNumber.toUpperCase() || ''}</b>`,
        }),
        {
          parse_mode: 'HTML',
          reply_markup: { remove_keyboard: true },
          reply_to_message_id: messageId,
        },
      );
    }

    return await ctx.reply(ctx.t('error-message-common'), {
      reply_markup: { remove_keyboard: true },
      reply_to_message_id: messageId,
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    Logger.error({
      context: 'src/conversations/support.conversation.ts::supportConversation',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return;
  }
};
