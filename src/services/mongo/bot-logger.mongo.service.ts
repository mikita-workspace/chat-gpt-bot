import { BotLoggerModel } from '@bot/models';
import { logger } from '@bot/services';
import { fetchCachedData } from '@bot/utils';
import { BotLoggerModelType } from 'types';

export class BotLoggerMongoService {
  async getBotLoggerInfo(): Promise<BotLoggerModelType[]> {
    try {
      const loggerInfo = await fetchCachedData('cached-logger-info', async () =>
        BotLoggerModel.find({}).sort({ timestamp: 1 }).exec(),
      );

      return loggerInfo ?? [];
    } catch (error) {
      logger.error(`mongoService::getLoggerInfo::${JSON.stringify(error.message)}`);

      return [];
    }
  }
}
