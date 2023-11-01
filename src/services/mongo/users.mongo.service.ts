import { config } from '@bot/config';
import { LimitsGPT, ModelGPT, UserRoles } from '@bot/constants';
import { UserConversationModel, UserModel } from '@bot/models';
import { logger, mongo } from '@bot/services';
import { MultipleUserType, UserModelType } from '@bot/types';
import { fetchCachedData, removeValueFromMemoryCache, setValueToMemoryCache } from '@bot/utils';

export class UsersMongoService {
  async getUsers(): Promise<UserModelType[]> {
    try {
      const users = await fetchCachedData('cached-users', async () =>
        UserModel.find({}).sort({ username: 1 }).exec(),
      );

      return users ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUsers::${JSON.stringify(error.message)}`);

      return [];
    }
  }

  async getUser(username: string): Promise<UserModelType | null> {
    try {
      const user = await fetchCachedData(`cached-user-${username}`, async () =>
        UserModel.findOne({ username }).exec(),
      );

      return user;
    } catch (error) {
      logger.error(`mongoService::getUser::${JSON.stringify(error.message)}`);

      return null;
    }
  }

  async setUser(username: string, role: UserRoles): Promise<void> {
    try {
      const existUserConversation = await mongo.getUserConversation(username);
      const [gptTokensAdmin, gptImagesAdmin] = LimitsGPT.SUPER_VIP.split('/');
      const [gptTokensModerator, gptImagesModerator] = LimitsGPT.PREMIUM.split('/');

      const user = new UserModel({
        role: username === config.SUPER_ADMIN_USERNAME ? UserRoles.SUPER_ADMIN : role,
        ...([UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(role) && {
          limit: {
            availableGPTModels: [ModelGPT.GIGA_CHAT, ModelGPT.GPT_3_5_TURBO],
            gptTokens: Number(gptTokensAdmin),
            gptImages: Number(gptImagesAdmin),
          },
        }),
        ...(UserRoles.MODERATOR === role && {
          limit: {
            gptTokens: Number(gptTokensModerator),
            gptImages: Number(gptImagesModerator),
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

  async setMultipleUsers(users: MultipleUserType[]): Promise<MultipleUserType[]> {
    try {
      const existingUsers = await this.getUsers();

      const newUsers = users.filter(
        (user) => !existingUsers.find((existingUser) => existingUser.username === user.username),
      );

      if (newUsers.length === 0) {
        return [];
      }

      newUsers.forEach(async ({ username, role }) => this.setUser(username, role));

      return newUsers ?? [];
    } catch (error) {
      logger.error(`mongoService::setMultipleUsers::${JSON.stringify(error.message)}`);

      return [];
    }
  }

  async updateUser(
    username: string,
    options: Partial<UserModelType>,
  ): Promise<UserModelType | null> {
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

      return null;
    }
  }

  async deleteUser(username: string): Promise<void> {
    try {
      await UserModel.findOneAndDelete({ username });

      removeValueFromMemoryCache(`cached-user-${username}`);
      removeValueFromMemoryCache('cached-users');
    } catch (error) {
      logger.error(`mongoService::deleteUser::${JSON.stringify(error.message)}`);
    }
  }
}
