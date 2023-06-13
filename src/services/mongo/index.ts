import { UserSessionModel } from '@bot/models';
import { SessionType } from '@bot/types';
import { applyMixins } from '@bot/utils';
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb';
import mongoose from 'mongoose';

import { BotLoggerMongoService } from './bot-logger.mongo.service';
import { UserConversationsMongoService } from './user-conversations.mongo.service';
import { UserImagesService } from './user-images.mongo.service';
import { UserSessionsMongoService } from './user-sessions.mongo.service';
import { UsersMongoService } from './users.mongo.service';

class MongoService {
  sessions: mongoose.mongo.Collection<ISession>;

  sessionAdapter: MongoDBAdapter<SessionType['user']>;

  constructor() {
    const sessions = mongoose.connection.collection<ISession>(UserSessionModel.collection.name);

    this.sessions = sessions;
    this.sessionAdapter = new MongoDBAdapter({ collection: sessions });
  }
}

interface MongoService
  extends BotLoggerMongoService,
    UserConversationsMongoService,
    UserImagesService,
    UserSessionsMongoService,
    UsersMongoService {}

applyMixins(MongoService, [
  BotLoggerMongoService,
  UserConversationsMongoService,
  UserImagesService,
  UserSessionsMongoService,
  UsersMongoService,
]);

export const mongo = new MongoService();
