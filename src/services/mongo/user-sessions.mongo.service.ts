import { UserSessionModel } from '@bot/models';
import { logger } from '@bot/services';
import { UserSessionModelType } from '@bot/types';
import { fetchCachedData, removeValueFromMemoryCache } from '@bot/utils';

export class UserSessionsMongoService {
  async getAllUserSessions(): Promise<UserSessionModelType[]> {
    try {
      const userSessions = await fetchCachedData('cached-all-session-messages', async () =>
        UserSessionModel.find({}).sort({ 'value.username': 1 }).exec(),
      );

      return userSessions ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUserSessionMessages::${JSON.stringify(error.message)}`);

      return [];
    }
  }

  async getUserSession(username: string): Promise<UserSessionModelType | null> {
    try {
      const userSessionMessages = await fetchCachedData(
        `cached-session-messages-${username}`,
        async () =>
          UserSessionModel.findOne({
            'value.username': username,
          }),
      );

      return userSessionMessages;
    } catch (error) {
      logger.error(`mongoService::getUserSessionMessages::${JSON.stringify(error.message)}`);

      return null;
    }
  }

  async deleteUserSessionMessages(username: string): Promise<void> {
    try {
      await UserSessionModel.findOneAndDelete({ 'value.username': username });

      removeValueFromMemoryCache(`cached-session-messages-${username}`);
      removeValueFromMemoryCache('cached-all-session-messages');
    } catch (error) {
      logger.error(`mongoService::deleteUserSessionMessages::${JSON.stringify(error.message)}`);
    }
  }
}
