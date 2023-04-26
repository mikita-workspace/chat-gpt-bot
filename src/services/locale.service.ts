import { I18n } from 'i18n';
import path from 'path';

class LocaleService {
  i18nProvider: I18n;

  constructor() {
    this.i18nProvider = new I18n({
      locales: ['en', 'ru'],
      defaultLocale: 'en',
      directory: path.join(__dirname, '../locales'),
    });
  }

  getCurrentLocale() {
    return this.i18nProvider.getLocale();
  }

  getLocales() {
    return this.i18nProvider.getLocales();
  }

  setLocale(locale = 'en') {
    if (this.getLocales().indexOf(locale) !== -1) {
      this.i18nProvider.setLocale(locale);
    }
  }

  translate(string: string, args = {}) {
    return this.i18nProvider.__(string, { ...args });
  }
}

export const i18n = new LocaleService();
