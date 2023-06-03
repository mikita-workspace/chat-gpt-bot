import { SessionModel } from '@bot/models';
import { logger } from '@bot/services';
import { fetchCachedData, removeValueFromMemoryCache } from '@bot/utils';

export class UserSessionsMongoService {
  async getAllUserSessions() {
    try {
      const allUserSessions = await fetchCachedData('cached-all-session-messages', async () =>
        SessionModel.find({}).exec(),
      );

      return allUserSessions ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUserSessionMessages::${JSON.stringify(error.message)}`);
    }
  }

  async getUserSession(username: string) {
    try {
      const userSessionMessages = await fetchCachedData(
        `cached-session-messages-${username}`,
        async () =>
          SessionModel.findOne({
            'value.username': username,
          }),
      );

      return userSessionMessages;
    } catch (error) {
      logger.error(`mongoService::getUserSessionMessages::${JSON.stringify(error.message)}`);
    }
  }

  async deleteUserSessionMessages(username: string) {
    try {
      await SessionModel.findOneAndDelete({ 'value.username': username });

      removeValueFromMemoryCache(`cached-session-messages-${username}`);
      removeValueFromMemoryCache('cached-all-session-messages');
    } catch (error) {
      logger.error(`mongoService::deleteUserSessionMessages::${JSON.stringify(error.message)}`);
    }
  }
}
