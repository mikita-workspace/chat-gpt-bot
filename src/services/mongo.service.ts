import { LoggerModel, SessionModel, UserConversationModel, UserModel } from '@bot/models';
import { logger } from '@bot/services';
import { SessionType } from '@bot/types';
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
      logger.error(`mongoService::getLoggerInfo::${(error as Error).message}`);
    }
  }

  async getUsers(resetCache = false) {
    try {
      if (resetCache) {
        removeValueFromMemoryCache('cached-users');
      }

      const users = await fetchCachedData('cached-users', async () => UserModel.find({}).exec());

      return users ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUsers::${(error as Error).message}`);
    }
  }

  async getUser(username: string) {
    try {
      const user = await fetchCachedData(`cached-user-${username}`, async () =>
        UserModel.findOne({ username }).exec(),
      );

      return user;
    } catch (error) {
      logger.error(`mongoService::getUser::${(error as Error).message}`);
    }
  }

  async setUser(username: string, role: string) {
    try {
      await UserModel.create({ username, role });
    } catch (error) {
      logger.error(`mongoService::setUser::${(error as Error).message}`);
    }
  }

  async updateUser(username: string, enabled: boolean) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { username },
        { enabled },
        { new: true },
      );

      setValueToMemoryCache(`cached-user-${username}`, JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      logger.error(`mongoService::updateUser::${(error as Error).message}`);
    }
  }

  async getAllUserSessions() {
    try {
      const allUserSessions = await fetchCachedData('cached-all-session-messages', async () =>
        SessionModel.find({}).exec(),
      );

      return allUserSessions ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUserSessionMessages::${(error as Error).message}`);
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

      return userSessionMessages ?? [];
    } catch (error) {
      logger.error(`mongoService::getUserSessionMessages::${(error as Error).message}`);
    }
  }

  async deleteUserSessionMessages(username: string) {
    try {
      await SessionModel.findOneAndDelete({ 'value.username': username });

      removeValueFromMemoryCache(`cached-session-messages-${username}`);
    } catch (error) {
      logger.error(`mongoService::deleteUserSessionMessages::${(error as Error).message}`);
    }
  }

  // TODO
  async getUserConversation(username: string) {}

  async updateUserConversation(username: string) {}

  async deleteUserConversation(username: string) {}
}

export const mongo = new MongoService();
