import { SessionModelType, UserModelType } from '@bot/types';
import { ISession, MongoDBAdapter } from '@grammyjs/storage-mongodb';
import mongoose from 'mongoose';
import { ChatCompletionRequestMessage, OpenAIApi } from 'openai';

export interface IOggConverter {
  toMp3(input: string, output: string): void;
  create(url: string, filename: string): void;
}

export interface IOpenAI {
  openAI: OpenAIApi;
  chat(messages: ChatCompletionRequestMessage[]): void;
  transcription(filepath: string): void;
}

export interface IMongo {
  sessions: mongoose.mongo.Collection<ISession>;
  sessionAdapter: MongoDBAdapter<unknown>;
  getUsers(): void;
  getUser(username: string): void;
  setUser(username: string, role: string): void;
  updateUser(username: string, enabled: boolean): void;
  getAllUserSessions(): void;
  getUserSession(username: string): void;
  deleteUserSessionMessages(username: string): void;
}

export interface ICsv {
  createSessionCsv(userSession: SessionModelType): void;
  createUsersCsv(users: UserModelType[]): void;
}
