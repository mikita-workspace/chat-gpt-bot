import { mapContextData } from '../utils';
import { UserModel } from '../models';
import { IMongoDB } from '../types';

class MongoDBService implements IMongoDB {
  async createOrGetUser(from: any) {
    const user = mapContextData(from);

    try {
      const userDB = await UserModel.findOne({
        telegramId: user.telegramId,
      });

      if (userDB) {
        return userDB;
      }

      const newUser = await new UserModel({
        telegramId: user.telegramId,
        firstname: user.firstname,
        username: user.username,
      }).save();

      return newUser;
    } catch (error) {
      console.error(
        `ERROR::MongoDBService::createOrGetUser::${(error as Error).message}`,
      );
    }
  }
}

export const mongoDB = new MongoDBService();
