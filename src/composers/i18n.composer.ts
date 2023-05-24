import { config } from '@bot/config';
import { modelGPT, supportLanguageCodes } from '@bot/constants';
import { mapBotCommands, mapBotDescription } from '@bot/helpers';
import { BotContextType } from '@bot/types';
import { I18n } from '@grammyjs/i18n';
import { Api, Composer, Middleware } from 'grammy';
import path from 'path';

const api = new Api(config.TELEGRAM_TOKEN);

const composer = new Composer<BotContextType>();

const i18n = new I18n<BotContextType>({
  defaultLocale: 'en',
  globalTranslationContext: (ctx) => ({
    botName: String(ctx?.me?.first_name),
    firstName: String(ctx?.from?.first_name),
    lastName: String(ctx?.from?.last_name),
    model: modelGPT,
    releaseVersion: config.RELEASE_VERSION,
    username: String(ctx?.from?.username),
  }),
  directory: path.join(__dirname, '../locales'),
  useSession: true,
});

supportLanguageCodes.forEach(async (languageCode) => {
  await api.setMyDescription(mapBotDescription(i18n, languageCode), {
    language_code: languageCode,
  });

  await api.setMyCommands(mapBotCommands(i18n, languageCode), {
    language_code: languageCode,
  });
});

composer.use(i18n);

export const i18nComposer = (): Middleware<BotContextType> => composer;
