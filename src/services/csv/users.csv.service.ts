import { UsersCsvIds } from '@bot/constants';
import { mapUsers } from '@bot/helpers';
import { csv } from '@bot/services';
import { UserModelType } from '@bot/types';

export class UsersCsvService {
  async createUsersCsv(users: UserModelType[]) {
    const usersHeader = [
      { id: UsersCsvIds.USERNAME, title: UsersCsvIds.USERNAME },
      { id: UsersCsvIds.ROLE, title: UsersCsvIds.ROLE },
      { id: UsersCsvIds.ENABLED, title: UsersCsvIds.ENABLED },
      { id: UsersCsvIds.TIMESTAMP, title: UsersCsvIds.TIMESTAMP },
      { id: UsersCsvIds.GPT_TOKENS, title: UsersCsvIds.GPT_TOKENS },
      { id: UsersCsvIds.GPT_IMAGES, title: UsersCsvIds.GPT_IMAGES },
      { id: UsersCsvIds.EXPIRE, title: UsersCsvIds.EXPIRE },
      { id: UsersCsvIds.GPT_MODELS, title: UsersCsvIds.GPT_MODELS },
    ];

    return csv.csvWriter('users', usersHeader, mapUsers(users));
  }
}
