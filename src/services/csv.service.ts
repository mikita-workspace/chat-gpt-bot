import { LoggerInfoCsvIds, SessionCsvIds, UsersCsvIds } from '@bot/constants';
import { mapLoggerInfo, mapUsers, mapUserSessionMessages } from '@bot/helpers';
import { logger } from '@bot/services';
import { LoggerModelType, SessionModelType, UserModelType } from '@bot/types';
import { removeFile } from '@bot/utils';
import axios from 'axios';
import csvPipe from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { ObjectMap } from 'csv-writer/src/lib/lang/object';
import { ObjectStringifierHeader } from 'csv-writer/src/lib/record';
import { createReadStream, createWriteStream } from 'fs';
import { InputFile } from 'grammy';
import { resolve as resolvePath } from 'path';

class CsvService {
  private readonly loggerHeader: ObjectStringifierHeader;

  private readonly usersHeader: ObjectStringifierHeader;

  private readonly sessionHeader: ObjectStringifierHeader;

  constructor() {
    this.loggerHeader = [
      { id: LoggerInfoCsvIds.TIMESTAMP, title: LoggerInfoCsvIds.TIMESTAMP },
      { id: LoggerInfoCsvIds.LEVEL, title: LoggerInfoCsvIds.LEVEL },
      { id: LoggerInfoCsvIds.USERNAME, title: LoggerInfoCsvIds.USERNAME },
      { id: LoggerInfoCsvIds.MESSAGE, title: LoggerInfoCsvIds.MESSAGE },
    ];
    this.usersHeader = [
      { id: UsersCsvIds.USERNAME, title: UsersCsvIds.USERNAME },
      { id: UsersCsvIds.ROLE, title: UsersCsvIds.ROLE },
      { id: UsersCsvIds.ENABLED, title: UsersCsvIds.ENABLED },
      { id: UsersCsvIds.TIMESTAMP, title: UsersCsvIds.TIMESTAMP },
      { id: UsersCsvIds.GPT_TOKENS, title: UsersCsvIds.GPT_TOKENS },
      { id: UsersCsvIds.GPT_IMAGES, title: UsersCsvIds.GPT_IMAGES },
      { id: UsersCsvIds.EXPIRE, title: UsersCsvIds.EXPIRE },
    ];
    this.sessionHeader = [
      { id: SessionCsvIds.KEY, title: SessionCsvIds.KEY },
      { id: SessionCsvIds.USERNAME, title: SessionCsvIds.USERNAME },
      { id: SessionCsvIds.ROLE, title: SessionCsvIds.ROLE },
      { id: SessionCsvIds.TIMESTAMP, title: SessionCsvIds.TIMESTAMP },
      { id: SessionCsvIds.CONTENT, title: SessionCsvIds.CONTENT },
    ];
  }

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
      logger.error(`csvService::csvWriter::${JSON.stringify(error.message)}`);
    }
  }

  async createCsv(url: string, filename: string) {
    try {
      const csvPath = resolvePath(__dirname, '../../assets', `${filename}.csv`);

      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      });

      return await new Promise<string>((resolve) => {
        const stream = createWriteStream(csvPath);

        response.data.pipe(stream);
        stream.on('finish', () => resolve(csvPath));
      });
    } catch (error) {
      logger.error(`csvService::createCsv::${JSON.stringify(error.message)}`);
    }
  }

  async parseCsv<T>(input: string) {
    try {
      return await new Promise<T[]>((resolve) => {
        const results: T[] = [];

        createReadStream(input)
          .pipe(csvPipe())
          .on('data', (data: T) => results.push(data))
          .on('end', async () => {
            await removeFile(input);
            resolve(results);
          });
      });
    } catch (error) {
      logger.error(`csvService::parseCsv::${JSON.stringify(error.message)}`);
    }
  }

  async createLoggerCsv(loggerInfo: LoggerModelType[]) {
    return this.csvWriter('logger-info', this.loggerHeader, mapLoggerInfo(loggerInfo));
  }

  async createUsersCsv(users: UserModelType[]) {
    return this.csvWriter('users', this.usersHeader, mapUsers(users));
  }

  async createSessionCsv(userSession: SessionModelType, withConversation = false) {
    return this.csvWriter(
      `${userSession.value.username}-${withConversation ? 'conversation' : 'session'}`,
      this.sessionHeader,
      mapUserSessionMessages(userSession),
    );
  }
}

export const csv = new CsvService();
