import mongoose from 'mongoose';
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb';
import { UserModel, SessionModel } from '../models';
import { fetchCachedData, removeValueFromMemoryCache } from '../utils';

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

  async setUser(username: string, role: string) {
    try {
      await UserModel.create({ username, role });
    } catch (error) {
      console.error(
        `ERROR::MongoService::setUser::${(error as Error).message}`,
      );
    }
  }

  async updateUser(
    username: string,
    firstName: string,
    lastName: string,
    telegramId: number,
  ) {
    try {
      await UserModel.findOneAndUpdate(
        { username },
        { firstName, lastName, telegramId },
        { new: true },
      );
    } catch (error) {
      console.error(
        `ERROR::MongoService::updateUser::${(error as Error).message}`,
      );
    }
  }

  async getUserSessionMessages(username: string) {
    try {
      const userSessionMessages = await fetchCachedData(
        `cached-session-messages-${username}`,
        async () =>
          SessionModel.findOne({
            'value.username': username,
          }),
      );

      return userSessionMessages?.value?.messages ?? [];
    } catch (error) {
      console.error(
        `ERROR::MongoService::getUserSessionMessages::${
          (error as Error).message
        }`,
      );
    }
  }

  async deleteUserSessionMessages(username: string) {
    try {
      await SessionModel.findOneAndDelete({ 'value.username': username });

      removeValueFromMemoryCache(`cached-session-messages-${username}`);
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
