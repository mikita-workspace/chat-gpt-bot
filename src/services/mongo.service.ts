import mongoose from 'mongoose';
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb';
import { UserModel } from '../models';
import { fetchCachedData, removeValueFromMemoryCache } from '../utils';
import { SessionType } from '../types';

export class MongoService {
  sessions: mongoose.mongo.Collection<ISession>;

  sessionAdapter: MongoDBAdapter<unknown>;

  constructor() {
    const sessions = mongoose.connection.collection<ISession>('sessions');

    this.sessions = sessions;
    this.sessionAdapter = new MongoDBAdapter({ collection: sessions });
  }

  async getUsers() {
    try {
      const users = await fetchCachedData('cached-users', async () =>
        UserModel.find({}).exec(),
      );

      return users;
    } catch (error) {
      console.error(
        `ERROR::MongoService::getAllUsers::${(error as Error).message}`,
      );
    }
  }

  async getUser(username: string) {
    try {
      const user = await fetchCachedData(`cached-user-${username}`, async () =>
        UserModel.findOne({ username }).exec(),
      );

      return user;
    } catch (error) {
      console.error(
        `ERROR::MongoService::getUser::${(error as Error).message}`,
      );
    }
  }

  async getUserSessionMessages(key: string) {
    try {
      const userSessionMessages = await fetchCachedData(
        `cached-session-messages-${key}`,
        async () => this.sessionAdapter.read(key),
      );

      return (userSessionMessages as unknown as SessionType)?.messages;
    } catch (error) {
      console.error(
        `ERROR::MongoService::getUserSessionMessages::${
          (error as Error).message
        }`,
      );
    }
  }

  async deleteUserSessionMessages(key: string) {
    try {
      await this.sessionAdapter.delete(key);

      removeValueFromMemoryCache(`cached-session-messages-${key}`);
    } catch (error) {
      console.error(
        `ERROR::MongoService::deleteUserSessionMessages::${
          (error as Error).message
        }`,
      );
    }
  }
}

export const mongo = new MongoService();
