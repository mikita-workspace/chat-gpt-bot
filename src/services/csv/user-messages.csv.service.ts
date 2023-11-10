import { SessionCsvIds } from '@bot/constants';
import { csv } from '@bot/services';
import { UserSessionModelType } from '@bot/types';

export class UserMessagesCsvService {
  async createUserMessagesCsv(userSession: UserSessionModelType, includesConversation = false) {
    const filename = `${userSession.value.username}-${
      includesConversation ? 'conversation' : 'session'
    }`;

    return [];

    // return csv.csvWriter(filename, userMessagesHeader, mapUserMessages(userSession));
  }
}
