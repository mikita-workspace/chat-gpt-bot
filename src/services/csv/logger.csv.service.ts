import { LoggerInfoCsvIds } from '@bot/constants';
import { mapLoggerInfo } from '@bot/helpers';
import { csv } from '@bot/services';
import { LoggerModelType } from '@bot/types';

export class LoggerCsvService {
  async createLoggerCsv(loggerInfo: LoggerModelType[]) {
    const loggerHeader = [
      { id: LoggerInfoCsvIds.TIMESTAMP, title: LoggerInfoCsvIds.TIMESTAMP },
      { id: LoggerInfoCsvIds.LEVEL, title: LoggerInfoCsvIds.LEVEL },
      { id: LoggerInfoCsvIds.USERNAME, title: LoggerInfoCsvIds.USERNAME },
      { id: LoggerInfoCsvIds.MESSAGE, title: LoggerInfoCsvIds.MESSAGE },
    ];

    return csv.csvWriter('logger-info', loggerHeader, mapLoggerInfo(loggerInfo));
  }
}
