import { SessionType } from '@bot/types';
import { applyMixins } from '@bot/utils';
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb';
import mongoose from 'mongoose';

import { LoggerMongoService } from './logger.mongo.service';
import { UserConversationsMongoService } from './user-conversations.mongo.service';
import { UserSessionsMongoService } from './user-sessions.mongo.service';
import { UsersMongoService } from './users.mongo.service';

class MongoService {
  sessions: mongoose.mongo.Collection<ISession>;

  sessionAdapter: MongoDBAdapter<SessionType['custom']>;

  constructor() {
    const sessions = mongoose.connection.collection<ISession>('sessions');

    this.sessions = sessions;
    this.sessionAdapter = new MongoDBAdapter({ collection: sessions });
  }
}

interface MongoService
  extends LoggerMongoService,
    UserConversationsMongoService,
    UserSessionsMongoService,
    UsersMongoService {}

applyMixins(MongoService, [
  LoggerMongoService,
  UserConversationsMongoService,
  UserSessionsMongoService,
  UsersMongoService,
]);

export const mongo = new MongoService();
