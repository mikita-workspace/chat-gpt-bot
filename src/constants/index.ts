// Open AI
export const modelGPT = 'gpt-3.5-turbo';

export const transcriptionModelGPT = 'whisper-1';

export enum MessageRolesGPT {
  ASSISTANT = 'assistant',
  USER = 'user',
  SYSTEM = 'system',
}

export const MAX_CONTEXT_GPT_TOKENS = 4096;

// Telegram API
export const TELEGRAM_API = 'https://api.telegram.org';

// Bot config
export const supportLanguageCodes = ['en', 'ru'];

export enum BotCommands {
  ABOUT = 'about',
  ADMIN = 'admin',
  CLEAR = 'clear',
  DESCRIPTION = 'description',
  MODERATOR = 'moderator',
  NEW = 'new',
  PROFILE = 'profile',
  START = 'start',
}

export const botName = 'ChatGPT | Smart Bot';

export const BotCommandsWithDescription = [
  // TODO: will be implemented here - https://github.com/mikita-kandratsyeu/chat-gpt-bot/issues/22
  // { command: BotCommands.PROFILE, i18nKey: 'command-profile' },
  { command: BotCommands.ADMIN, i18nKey: 'command-admin' },
  { command: BotCommands.MODERATOR, i18nKey: 'command-moderator' },
  { command: BotCommands.DESCRIPTION, i18nKey: 'command-description' },
  { command: BotCommands.ABOUT, i18nKey: 'command-about' },
];

// Node cache
export const TTL_DEFAULT = 60;

// Privileges
export enum UserRoles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPER_ADMIN = 'super-admin',
  USER = 'user',
}

export const addUserFormat = (userRole: `${UserRoles}`) =>
  `<username>;<${Object.values(UserRoles)
    .filter((role) => role !== UserRoles.SUPER_ADMIN)
    .filter(
      (role) =>
        userRole !== UserRoles.MODERATOR ||
        (role !== UserRoles.ADMIN && role !== UserRoles.MODERATOR),
    )
    .join(' | ')}>`;

export const ADD_USER_CSV_FORMAT = '<username> | <role>';

// Regexp
export const REGEXP_USERNAME = /^[a-zA-Z0-9_]{5,32}$/;
export const REGEXP_CSV_FILE_TYPE = /.+(\.csv)$/;

// CSV files
export const CSV_READER_URL = 'https://www.convertcsv.com/csv-viewer-editor.htm';

export enum SessionCsvIds {
  CONTENT = 'content',
  KEY = 'key',
  ROLE = 'role',
  TIMESTAMP = 'timestamp',
  USERNAME = 'username',
}

export enum UsersCsvIds {
  ENABLED = 'enabled',
  ROLE = 'role',
  TIMESTAMP = 'timestamp',
  USERNAME = 'username',
}

export enum LoggerInfoCsvIds {
  LEVEL = 'level',
  MESSAGE = 'message',
  TIMESTAMP = 'timestamp',
  USERNAME = 'username',
}

// Winston logger
export const winstonConfig = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'magenta',
    info: 'green',
    verbose: 'cyan',
    silly: 'grey',
  },
};

// Menu
export enum AdminMenu {
  INITIAL = 'admin-main-menu',
  NAME = 'admin',
}

export enum ModeratorMenu {
  INITIAL = 'moderator-main-menu',
  NAME = 'moderator',
}

// Submenu
export enum SessionsMenu {
  DELETE = 'delete-user-session-menu',
  GET = 'get-user-session-menu',
  INITIAL = 'sessions-menu',
}

export enum ConversationsMenu {
  DELETE = 'delete-user-conversation-menu',
  GET = 'get-user-conversation-menu',
  INITIAL = 'conversations-menu',
}

export enum UsersMenu {
  BLOCK_UNBLOCK = 'block-unblock-user-menu',
  CHANGE_ROLE = 'change-user-role-menu',
  DELETE = 'delete-user-menu',
  INITIAL = 'users-menu',
  SELECT_NEW_ROLE = 'select-new-user-role-menu',
}

// Menu actions
export enum AdminMenuActions {
  GO_TO_MENU = 'go-to-admin-menu-action',
}

export enum UsersMenuActions {
  ADD_NEW_USER = 'add-new-user-action',
  ADD_NEW_MULTIPLE_USERS = 'add-new-multiple-users-action',
}

export enum ModeratorMenuActions {
  GO_TO_MENU = 'go-to-moderator-menu-action',
}
