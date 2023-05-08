import mongoose from 'mongoose';
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb';
import { UserModel, SessionModel } from '../models';
import { fetchCachedData, removeValueFromMemoryCache, setValueToMemoryCache } from '../utils';
import { IMongo } from '../types';

export class MongoService implements IMongo {
  sessions: mongoose.mongo.Collection<ISession>;

  sessionAdapter: MongoDBAdapter<unknown>;

  constructor() {
    const sessions = mongoose.connection.collection<ISession>('sessions');

    this.sessions = sessions;
    this.sessionAdapter = new MongoDBAdapter({ collection: sessions });
  }

  async getUsers() {
    try {
      const users = await fetchCachedData('cached-users', async () => UserModel.find({}).exec());

      return users ?? [];
    } catch (error) {
      console.error(`ERROR::MongoService::getAllUsers::${(error as Error).message}`);
    }
  }

  async getUser(username: string) {
    try {
      const user = await fetchCachedData(`cached-user-${username}`, async () =>
        UserModel.findOne({ username }).exec(),
      );

      return user;
    } catch (error) {
      console.error(`ERROR::MongoService::getUser::${(error as Error).message}`);
    }
  }

  async setUser(username: string, role: string) {
    try {
      await UserModel.create({ username, role });
    } catch (error) {
      console.error(`ERROR::MongoService::setUser::${(error as Error).message}`);
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
      console.error(`ERROR::MongoService::updateUser::${(error as Error).message}`);
    }
  }

  async getAllUserSessions() {
    try {
      const allUserSessions = await fetchCachedData('cached-all-session-messages', async () =>
        SessionModel.find({}).exec(),
      );

      return allUserSessions ?? [];
    } catch (error) {
      console.error(`ERROR::MongoService::getAllUserSessionMessages::${(error as Error).message}`);
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
      console.error(`ERROR::MongoService::getUserSessionMessages::${(error as Error).message}`);
    }
  }

  async deleteUserSessionMessages(username: string) {
    try {
      await SessionModel.findOneAndDelete({ 'value.username': username });

      removeValueFromMemoryCache(`cached-session-messages-${username}`);
    } catch (error) {
      console.error(`ERROR::MongoService::deleteUserSessionMessages::${(error as Error).message}`);
    }
  }
}

export const mongo = new MongoService();
