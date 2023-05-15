import { LoggerInfoCsvIds, SessionCsvIds, UsersCsvIds } from '@bot/constants';
import { mapLoggerInfo, mapUsers, mapUserSessionMessages } from '@bot/helpers';
import { logger } from '@bot/services';
import { ICsv, LoggerModelType, SessionModelType, UserModelType } from '@bot/types';
import { createObjectCsvWriter } from 'csv-writer';
import { InputFile } from 'grammy';
import { resolve as resolvePath } from 'path';

class CsvService implements ICsv {
  async createLoggerCsv(loggerInfo: LoggerModelType[]) {
    try {
      const filePath = resolvePath(__dirname, '../../assets', 'logger-info.csv');
      const writer = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: LoggerInfoCsvIds.TIMESTAMP, title: LoggerInfoCsvIds.TIMESTAMP },
          { id: LoggerInfoCsvIds.LEVEL, title: LoggerInfoCsvIds.LEVEL },
          { id: LoggerInfoCsvIds.MESSAGE, title: LoggerInfoCsvIds.MESSAGE },
        ],
      });

      const mappedLoggerInfo = mapLoggerInfo(loggerInfo);

      await writer.writeRecords(mappedLoggerInfo);

      return {
        filePath,
        filePathForReply: new InputFile(filePath),
      };
    } catch (error) {
      logger.error(`csvService::createLoggerCsv::${(error as Error).message}`);
    }
  }

  async createUsersCsv(users: UserModelType[]) {
    try {
      const filePath = resolvePath(__dirname, '../../assets', 'users.csv');
      const writer = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: UsersCsvIds.USERNAME, title: UsersCsvIds.USERNAME },
          { id: UsersCsvIds.ROLE, title: UsersCsvIds.ROLE },
          { id: UsersCsvIds.ENABLED, title: UsersCsvIds.ENABLED },
          { id: UsersCsvIds.TIMESTAMP, title: UsersCsvIds.TIMESTAMP },
        ],
      });

      const mappedUsers = mapUsers(users);

      await writer.writeRecords(mappedUsers);

      return {
        filePath,
        filePathForReply: new InputFile(filePath),
      };
    } catch (error) {
      logger.error(`csvService::createUsersCsv::${(error as Error).message}`);
    }
  }

  async createSessionCsv(userSession: SessionModelType) {
    try {
      const filePath = resolvePath(
        __dirname,
        '../../assets',
        `${userSession.value.username}-session.csv`,
      );

      const writer = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: SessionCsvIds.KEY, title: SessionCsvIds.KEY },
          { id: SessionCsvIds.USERNAME, title: SessionCsvIds.USERNAME },
          { id: SessionCsvIds.ROLE, title: SessionCsvIds.ROLE },
          { id: SessionCsvIds.TIMESTAMP, title: SessionCsvIds.TIMESTAMP },
          { id: SessionCsvIds.CONTENT, title: SessionCsvIds.CONTENT },
        ],
      });

      const mappedUserSession = mapUserSessionMessages(userSession);

      await writer.writeRecords(mappedUserSession);

      return {
        filePath,
        filePathForReply: new InputFile(filePath),
      };
    } catch (error) {
      logger.error(`csvService::createSessionCsv::${(error as Error).message}`);
    }
  }
}

export const csv = new CsvService();
