import { UserConversationModel } from '@bot/models';
import { logger } from '@bot/services';
import { SessionMessageType } from '@bot/types';
import {
  fetchCachedData,
  removeValueFromMemoryCache,
  setValueToMemoryCache,
  uniqBy,
} from '@bot/utils';

export class UserConversationsMongoService {
  async getAllUserConversations() {
    try {
      const userConversations = await fetchCachedData('cached-user-conversations', async () =>
        UserConversationModel.find({}).exec(),
      );

      return userConversations ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUserConversations::${JSON.stringify(error.message)}`);
    }
  }

  async getUserConversation(username: string) {
    try {
      const userConversation = await fetchCachedData(
        `cached-user-conversation-${username}`,
        async () => UserConversationModel.findOne({ username }).exec(),
      );

      return userConversation;
    } catch (error) {
      logger.error(`mongoService::getUserConversation::${JSON.stringify(error.message)}`);
    }
  }

  async updateUserConversation(username: string, messages: SessionMessageType[]) {
    try {
      const userConversation = await this.getUserConversation(username);

      const updatedUserConversation = await UserConversationModel.findOneAndUpdate(
        { username },
        {
          messages: uniqBy(
            [...(messages ?? []), ...(userConversation.messages ?? [])],
            'timestamp',
          ),
        },
        { new: true },
      );

      setValueToMemoryCache(
        `cached-user-conversation-${username}`,
        JSON.stringify(updatedUserConversation),
      );

      return updatedUserConversation;
    } catch (error) {
      logger.error(`mongoService::updateUserConversation::${JSON.stringify(error.message)}`);
    }
  }

  async deleteUserConversation(username: string) {
    try {
      await UserConversationModel.findOneAndDelete({ username });

      removeValueFromMemoryCache(`cached-user-conversation-${username}`);
      removeValueFromMemoryCache('cached-user-conversations');
    } catch (error) {
      logger.error(`mongoService::deleteUserConversation::${JSON.stringify(error.message)}`);
    }
  }
}
