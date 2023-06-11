import { logger } from '@bot/services';
import { applyMixins, removeFile } from '@bot/utils';
import axios from 'axios';
import csvPipe from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { ObjectMap } from 'csv-writer/src/lib/lang/object';
import { ObjectStringifierHeader } from 'csv-writer/src/lib/record';
import { createReadStream, createWriteStream } from 'fs';
import { InputFile } from 'grammy';
import { resolve as resolvePath } from 'path';

import { BotLoggerCsvService } from './bot-logger.csv.service';
import { UserImagesCsvService } from './user-images.csv.service';
import { UserMessagesCsvService } from './user-messages.csv.service';
import { UsersCsvService } from './users.csv.service';

class CsvService {
  async csvWriter<T>(filename: string, header: ObjectStringifierHeader, objectMap: ObjectMap<T>[]) {
    try {
      const filePath = resolvePath(__dirname, '../../../assets', `${filename}.csv`);
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

      return {};
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

      return [];
    }
  }

  async createCsv(url: string, filename: string) {
    try {
      const csvPath = resolvePath(__dirname, '../../../assets', `${filename}.csv`);

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

      return '';
    }
  }
}

interface CsvService
  extends BotLoggerCsvService,
    UserMessagesCsvService,
    UsersCsvService,
    UserImagesCsvService {}

applyMixins(CsvService, [
  BotLoggerCsvService,
  UserMessagesCsvService,
  UsersCsvService,
  UserImagesCsvService,
]);

export const csv = new CsvService();
