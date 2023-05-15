import { LoggerInfoCsvIds, SessionCsvIds, UsersCsvIds } from '@bot/constants';
import { mapLoggerInfo, mapUsers, mapUserSessionMessages } from '@bot/helpers';
import { logger } from '@bot/services';
import { ICsv, LoggerModelType, SessionModelType, UserModelType } from '@bot/types';
import { createObjectCsvWriter } from 'csv-writer';
import { ObjectMap } from 'csv-writer/src/lib/lang/object';
import { ObjectStringifierHeader } from 'csv-writer/src/lib/record';
import { InputFile } from 'grammy';
import { resolve as resolvePath } from 'path';

class CsvService implements ICsv {
  private async csvWriter<T>(
    filename: string,
    header: ObjectStringifierHeader,
    objectMap: ObjectMap<T>[],
  ) {
    try {
      const filePath = resolvePath(__dirname, '../../assets', `${filename}.csv`);
      const writer = createObjectCsvWriter({
        path: filePath,
        header,
      });

      await writer.writeRecords(objectMap);

      return {
        filePath,
        filePathForReply: new InputFile(filePath),
      };
    } catch (error) {
      logger.error(`csvService::csvWriter::${(error as Error).message}`);
    }
  }

  async createLoggerCsv(loggerInfo: LoggerModelType[]) {
    const header = [
      { id: LoggerInfoCsvIds.TIMESTAMP, title: LoggerInfoCsvIds.TIMESTAMP },
      { id: LoggerInfoCsvIds.LEVEL, title: LoggerInfoCsvIds.LEVEL },
      { id: LoggerInfoCsvIds.MESSAGE, title: LoggerInfoCsvIds.MESSAGE },
    ];

    const mappedLoggerInfo = mapLoggerInfo(loggerInfo);

    return this.csvWriter('logger-info', header, mappedLoggerInfo);
  }

  async createUsersCsv(users: UserModelType[]) {
    const header = [
      { id: UsersCsvIds.USERNAME, title: UsersCsvIds.USERNAME },
      { id: UsersCsvIds.ROLE, title: UsersCsvIds.ROLE },
      { id: UsersCsvIds.ENABLED, title: UsersCsvIds.ENABLED },
      { id: UsersCsvIds.TIMESTAMP, title: UsersCsvIds.TIMESTAMP },
    ];

    const mappedUsers = mapUsers(users);

    return this.csvWriter('users', header, mappedUsers);
  }

  async createSessionCsv(userSession: SessionModelType) {
    const header = [
      { id: SessionCsvIds.KEY, title: SessionCsvIds.KEY },
      { id: SessionCsvIds.USERNAME, title: SessionCsvIds.USERNAME },
      { id: SessionCsvIds.ROLE, title: SessionCsvIds.ROLE },
      { id: SessionCsvIds.TIMESTAMP, title: SessionCsvIds.TIMESTAMP },
      { id: SessionCsvIds.CONTENT, title: SessionCsvIds.CONTENT },
    ];

    const mappedUserSession = mapUserSessionMessages(userSession);

    return this.csvWriter(`${userSession.value.username}-session`, header, mappedUserSession);
  }
}

export const csv = new CsvService();
