import { BotCommandsWithDescription, botName, modelGPT } from '@bot/constants';
import { BotContextType } from '@bot/types';
import { I18n } from '@grammyjs/i18n';

export const mapBotCommands = (i18n: I18n<BotContextType>, languageCode = 'en') =>
  BotCommandsWithDescription.map(({ command, i18nKey }) => ({
    command,
    description: i18n.t(languageCode, i18nKey),
  }));

export const mapBotDescription = (i18n: I18n<BotContextType>, languageCode = 'en') =>
  i18n.t(languageCode, 'initial-message-description', { botName, model: modelGPT });
