import { config } from '@bot/config';
import { UserRoles } from '@bot/constants';
import { LoggerModel, SessionModel, UserConversationModel, UserModel } from '@bot/models';
import { logger } from '@bot/services';
import { SessionMessagesType, SessionType, UserModelType } from '@bot/types';
import { fetchCachedData, removeValueFromMemoryCache, setValueToMemoryCache } from '@bot/utils';
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb';
import mongoose from 'mongoose';

export class MongoService {
  sessions: mongoose.mongo.Collection<ISession>;

  sessionAdapter: MongoDBAdapter<SessionType['custom']>;

  constructor() {
    const sessions = mongoose.connection.collection<ISession>('sessions');

    this.sessions = sessions;
    this.sessionAdapter = new MongoDBAdapter({ collection: sessions });
  }

  async getLoggerInfo() {
    try {
      const loggerInfo = await fetchCachedData('cached-logger-info', async () =>
        LoggerModel.find({}).exec(),
      );

      return loggerInfo ?? [];
    } catch (error) {
      logger.error(`mongoService::getLoggerInfo::${error.message}`);
    }
  }

  async getUsers() {
    try {
      const users = await fetchCachedData('cached-users', async () => UserModel.find({}).exec());

      return users ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUsers::${error.message}`);
    }
  }

  async getUser(username: string) {
    try {
      const user = await fetchCachedData(`cached-user-${username}`, async () =>
        UserModel.findOne({ username }).exec(),
      );

      return user;
    } catch (error) {
      logger.error(`mongoService::getUser::${error.message}`);
    }
  }

  async setUser(username: string, role: string) {
    try {
      const userConversation =
        (await this.getUserConversation(username)) ??
        new UserConversationModel({ username, messages: [] });

      const user = new UserModel({
        conversation: userConversation._id,
        role: username === config.SUPER_ADMIN_USERNAME ? UserRoles.SUPER_ADMIN : role,
        username,
      });

      await userConversation.save();
      await user.save();

      setValueToMemoryCache(`cached-user-${username}`, JSON.stringify(user));
      removeValueFromMemoryCache('cached-users');
    } catch (error) {
      logger.error(`mongoService::setUser::${error.message}`);
    }
  }

  async setMultipleUsers(users: { username: string; role: string }[]) {
    try {
      const existingUsers: UserModelType[] = await this.getUsers();

      const newUsers = users.filter(
        (user) => !existingUsers.find((existingUser) => existingUser.username === user.username),
      );

      if (newUsers.length === 0) {
        return [];
      }

      newUsers.forEach(async ({ username, role }) => this.setUser(username, role));

      return newUsers;
    } catch (error) {
      logger.error(`mongoService::setMultipleUsers::${error.message}`);
    }
  }

  async updateUser(username: string, options: Partial<UserModelType>) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { username },
        { ...options },
        { new: true },
      );

      setValueToMemoryCache(`cached-user-${username}`, JSON.stringify(updatedUser));
      removeValueFromMemoryCache('cached-users');

      return updatedUser;
    } catch (error) {
      logger.error(`mongoService::updateUser::${error.message}`);
    }
  }

  async deleteUser(username: string) {
    try {
      await UserModel.findOneAndDelete({ username });

      removeValueFromMemoryCache(`cached-user-${username}`);
      removeValueFromMemoryCache('cached-users');
    } catch (error) {
      logger.error(`mongoService::deleteUser::${error.message}`);
    }
  }

  async getAllUserSessions() {
    try {
      const allUserSessions = await fetchCachedData('cached-all-session-messages', async () =>
        SessionModel.find({}).exec(),
      );

      return allUserSessions ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUserSessionMessages::${error.message}`);
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
      logger.error(`mongoService::getUserSessionMessages::${error.message}`);
    }
  }

  async deleteUserSessionMessages(username: string) {
    try {
      await SessionModel.findOneAndDelete({ 'value.username': username });

      removeValueFromMemoryCache(`cached-session-messages-${username}`);
      removeValueFromMemoryCache('cached-all-session-messages');
    } catch (error) {
      logger.error(`mongoService::deleteUserSessionMessages::${error.message}`);
    }
  }

  async getAllUserConversations() {
    try {
      const userConversations = await fetchCachedData('cached-user-conversations', async () =>
        UserConversationModel.find({}).exec(),
      );

      return userConversations ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUserConversations::${error.message}`);
    }
  }

  async getUserConversation(username: string) {
    try {
      const userConversation = await fetchCachedData(
        `cached-user-conversation-${username}`,
        async () => UserConversationModel.findOne({ username }),
      );

      return userConversation;
    } catch (error) {
      logger.error(`mongoService::getUserConversation::${error.message}`);
    }
  }

  async updateUserConversation(username: string, messages: SessionMessagesType) {
    try {
      const updatedUserConversation = await UserConversationModel.findOneAndUpdate(
        { username },
        { messages },
        { new: true },
      );

      setValueToMemoryCache(
        `cached-user-conversation-${username}`,
        JSON.stringify(updatedUserConversation),
      );

      return updatedUserConversation;
    } catch (error) {
      logger.error(`mongoService::updateUserConversation::${error.message}`);
    }
  }

  async deleteUserConversation(username: string) {
    try {
      await UserConversationModel.findOneAndDelete({ username });

      removeValueFromMemoryCache(`cached-user-conversation-${username}`);
      removeValueFromMemoryCache('cached-user-conversations');
    } catch (error) {
      logger.error(`mongoService::deleteUserConversation::${error.message}`);
    }
  }
}

export const mongo = new MongoService();
