import { SessionCsvIds } from '@bot/constants';
import { mapUserMessages } from '@bot/helpers';
import { csv } from '@bot/services';
import { UserSessionModelType } from '@bot/types';

export class UserMessagesCsvService {
  async createUserMessagesCsv(userSession: UserSessionModelType, includesConversation = false) {
    const userMessagesHeader = [
      { id: SessionCsvIds.KEY, title: SessionCsvIds.KEY },
      { id: SessionCsvIds.USERNAME, title: SessionCsvIds.USERNAME },
      { id: SessionCsvIds.ROLE, title: SessionCsvIds.ROLE },
      { id: SessionCsvIds.TIMESTAMP, title: SessionCsvIds.TIMESTAMP },
      { id: SessionCsvIds.CONTENT, title: SessionCsvIds.CONTENT },
    ];

    const filename = `${userSession.value.username}-${
      includesConversation ? 'conversation' : 'session'
    }`;

    return [];

    // return csv.csvWriter(filename, userMessagesHeader, mapUserMessages(userSession));
  }
}
