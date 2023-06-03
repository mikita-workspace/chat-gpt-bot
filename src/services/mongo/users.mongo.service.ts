import { config } from '@bot/config';
import {
  PER_DAY_GPT_IMAGE_LIMIT_ADMIN,
  PER_DAY_GPT_TOKEN_LIMIT_ADMIN,
  UserRoles,
} from '@bot/constants';
import { UserConversationModel, UserModel } from '@bot/models';
import { logger, mongo } from '@bot/services';
import { UserModelType } from '@bot/types';
import { fetchCachedData, removeValueFromMemoryCache, setValueToMemoryCache } from '@bot/utils';

export class UsersMongoService {
  async getUsers() {
    try {
      const users = await fetchCachedData('cached-users', async () => UserModel.find({}).exec());

      return users ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUsers::${JSON.stringify(error.message)}`);
    }
  }

  async getUser(username: string) {
    try {
      const user = await fetchCachedData(`cached-user-${username}`, async () =>
        UserModel.findOne({ username }).exec(),
      );

      return user;
    } catch (error) {
      logger.error(`mongoService::getUser::${JSON.stringify(error.message)}`);
    }
  }

  async setUser(username: string, role: UserRoles) {
    try {
      const existUserConversation = await mongo.getUserConversation(username);

      const user = new UserModel({
        role: username === config.SUPER_ADMIN_USERNAME ? UserRoles.SUPER_ADMIN : role,

        ...([UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(role) && {
          limit: {
            gptTokens: PER_DAY_GPT_TOKEN_LIMIT_ADMIN,
            gptImages: PER_DAY_GPT_IMAGE_LIMIT_ADMIN,
          },
        }),
        username,
      });

      if (existUserConversation) {
        user.set('conversation', existUserConversation._id);
      } else {
        const userConversation = new UserConversationModel({ username, messages: [] });

        user.set('conversation', userConversation._id);

        await userConversation.save();

        setValueToMemoryCache(
          `cached-user-conversation-${username}`,
          JSON.stringify(userConversation),
        );
      }

      await user.save();

      setValueToMemoryCache(`cached-user-${username}`, JSON.stringify(user));
      removeValueFromMemoryCache('cached-users');
    } catch (error) {
      logger.error(`mongoService::setUser::${JSON.stringify(error.message)}`);
    }
  }

  async setMultipleUsers(users: { username: string; role: UserRoles }[]) {
    try {
      const existingUsers: UserModelType[] = await this.getUsers();

      const newUsers = users.filter(
        (user) => !existingUsers.find((existingUser) => existingUser.username === user.username),
      );

      if (newUsers.length === 0) {
        return [];
      }

      newUsers.forEach(async ({ username, role }) => this.setUser(username, role));

      return newUsers;
    } catch (error) {
      logger.error(`mongoService::setMultipleUsers::${JSON.stringify(error.message)}`);
    }
  }

  async updateUser(username: string, options: Partial<UserModelType>) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { username },
        { ...options },
        { new: true },
      );

      setValueToMemoryCache(`cached-user-${username}`, JSON.stringify(updatedUser));
      removeValueFromMemoryCache('cached-users');

      return updatedUser;
    } catch (error) {
      logger.error(`mongoService::updateUser::${JSON.stringify(error.message)}`);
    }
  }

  async deleteUser(username: string) {
    try {
      await UserModel.findOneAndDelete({ username });

      removeValueFromMemoryCache(`cached-user-${username}`);
      removeValueFromMemoryCache('cached-users');
    } catch (error) {
      logger.error(`mongoService::deleteUser::${JSON.stringify(error.message)}`);
    }
  }
}
