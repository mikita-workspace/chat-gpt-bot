import { LoggerModel } from '@bot/models';
import { logger } from '@bot/services';
import { fetchCachedData } from '@bot/utils';

export class LoggerMongoService {
  async getLoggerInfo() {
    try {
      const loggerInfo = await fetchCachedData('cached-logger-info', async () =>
        LoggerModel.find({}).exec(),
      );

      return loggerInfo ?? [];
    } catch (error) {
      logger.error(`mongoService::getLoggerInfo::${JSON.stringify(error.message)}`);
    }
  }
}
