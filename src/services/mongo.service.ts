import mongoose from 'mongoose';
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb';
import { UserModel } from '../models';
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
      const users = await UserModel.find({}).exec();

      return users;
    } catch (error) {
      console.error(
        `ERROR::MongoService::getAllUsers::${(error as Error).message}`,
      );
    }
  }

  async getEnabledUsers() {
    try {
      const enabledUsers = await UserModel.find({ enabled: true }).exec();

      return enabledUsers;
    } catch (error) {
      console.error(
        `ERROR::MongoService::getAllUsers::${(error as Error).message}`,
      );
    }
  }

  async getUser(username: string) {
    try {
      const user = await UserModel.findOne({ username }).exec();

      return user;
    } catch (error) {
      console.error(
        `ERROR::MongoService::getUser::${(error as Error).message}`,
      );
    }
  }

  async getUserSessionMessages(key: string) {
    try {
      const userSessionMessages = await this.sessionAdapter.read(key);

      return (userSessionMessages as unknown as SessionType)?.messages;
    } catch (error) {
      console.error(
        `ERROR::MongoService::getUserSessionMessages::${
          (error as Error).message
        }`,
      );
    }
  }
}

export const mongo = new MongoService();
