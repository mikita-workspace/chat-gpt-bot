import { LoggerInfoCsvIds } from '@bot/constants';
import { mapBotLoggerInfo } from '@bot/helpers';
import { csv } from '@bot/services';
import { BotLoggerModelType } from '@bot/types';

export class BotLoggerCsvService {
  async createBotLoggerCsv(loggerInfo: BotLoggerModelType[]) {
    const loggerHeader = [
      { id: LoggerInfoCsvIds.TIMESTAMP, title: LoggerInfoCsvIds.TIMESTAMP },
      { id: LoggerInfoCsvIds.LEVEL, title: LoggerInfoCsvIds.LEVEL },
      { id: LoggerInfoCsvIds.USERNAME, title: LoggerInfoCsvIds.USERNAME },
      { id: LoggerInfoCsvIds.MESSAGE, title: LoggerInfoCsvIds.MESSAGE },
    ];

    return csv.csvWriter('bot-logger-info', loggerHeader, mapBotLoggerInfo(loggerInfo));
  }
}
