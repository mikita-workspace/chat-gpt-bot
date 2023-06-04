import { UserSessionModel } from '@bot/models';
import { SessionType } from '@bot/types';
import { applyMixins } from '@bot/utils';
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb';
import mongoose from 'mongoose';

import { BotLoggerMongoService } from './bot-logger.mongo.service';
import { UserConversationsMongoService } from './user-conversations.mongo.service';
import { UserSessionsMongoService } from './user-sessions.mongo.service';
import { UsersMongoService } from './users.mongo.service';

class MongoService {
  sessions: mongoose.mongo.Collection<ISession>;

  sessionAdapter: MongoDBAdapter<SessionType['custom']>;

  constructor() {
    const sessions = mongoose.connection.collection<ISession>(UserSessionModel.collection.name);

    this.sessions = sessions;
    this.sessionAdapter = new MongoDBAdapter({ collection: sessions });
  }
}

interface MongoService
  extends BotLoggerMongoService,
    UserConversationsMongoService,
    UserSessionsMongoService,
    UsersMongoService {}

applyMixins(MongoService, [
  BotLoggerMongoService,
  UserConversationsMongoService,
  UserSessionsMongoService,
  UsersMongoService,
]);

export const mongo = new MongoService();
