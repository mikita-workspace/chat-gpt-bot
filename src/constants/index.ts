// Open AI
export const modelGPT = 'gpt-3.5-turbo';

export const transcriptionModelGPT = 'whisper-1';

export enum MessageRolesGPT {
  ASSISTANT = 'assistant',
  USER = 'user',
  SYSTEM = 'system',
}

export const MAX_CONTEXT_GPT_TOKENS = 4096;
export const IMAGE_SIZE_DEFAULT = '512x512';
export const MAX_IMAGES_REQUEST = 3;

// Telegram API
export const TELEGRAM_API = 'https://api.telegram.org';
export const WEBHOOK_TIMEOUT = 60_000;

// Github API
export const GITHUB_API = 'https://api.github.com';

// Bot config
export const supportLanguageCodes = ['en', 'ru', 'be'];

export enum BotCommands {
  ABOUT = 'about',
  ADMIN = 'admin',
  CLEAR = 'clear',
  DESCRIPTION = 'description',
  IMAGE = 'image',
  MODERATOR = 'moderator',
  PROFILE = 'profile',
  START = 'start',
}

export const botName = 'Pied Piper | GPT';

export const BotCommandsWithDescription = [
  { command: BotCommands.PROFILE, i18nKey: 'command-profile' },
  { command: BotCommands.CLEAR, i18nKey: 'command-clear' },
  { command: BotCommands.IMAGE, i18nKey: 'command-image' },
  { command: BotCommands.ADMIN, i18nKey: 'command-admin' },
  { command: BotCommands.MODERATOR, i18nKey: 'command-moderator' },
  { command: BotCommands.DESCRIPTION, i18nKey: 'command-description' },
  { command: BotCommands.ABOUT, i18nKey: 'command-about' },
];

// Per day GPT Token limits
export enum GPTLimits {
  BASE = '4096/5',
  PREMIUM = '8192/10',
  VIP = '16384/20',
  SUPER_VIP = '32768/50',
}

export const DAY_MS = 60 * 60 * 24 * 1000;

// Node cache
export const TTL_DEFAULT = process.env.NODE_ENV !== 'production' ? 60 : 600;

// Privileges
export enum UserRoles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPER_ADMIN = 'super-admin',
  USER = 'user',
}

export const addUserFormat = (userRole: UserRoles) =>
  '<username>' +
  `${
    [UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(userRole)
      ? `;<${Object.values(UserRoles)
          .filter((role) => role !== UserRoles.SUPER_ADMIN)
          .join(' | ')}>`
      : ''
  }`;

export const ADD_USER_CSV_FORMAT = '<username> | <role>';

// Image
export const CREATE_IMAGE_QUERY_FORMAT = `<prompt>;<1-${MAX_IMAGES_REQUEST}>`;

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
  EXPIRE = 'expire',
  GPT_IMAGES = 'gptImages',
  GPT_TOKENS = 'gptTokens',
  ROLE = 'role',
  TIMESTAMP = 'timestamp',
  USERNAME = 'username',
}

export enum UserImagesCsvIds {
  PROMPT = 'prompt',
  DRIVE_LINKS = 'drive_links',
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

// Root menu
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
  BLOCK_UNBLOCK = 'block-unblock-users-menu',
  CHANGE_GPT_LIMITS = 'change-limits-users-menu',
  CHANGE_ROLE = 'change-role-users-menu',
  DELETE = 'delete-users-menu',
  INITIAL = 'users-menu',
  SELECT_NEW_ROLE = 'new-role-users-menu',
  SELECT_NEW_GPT_LIMITS = 'new-limits-users-menu',
}

export enum UserImagesMenu {
  INITIAL = 'user-images-menu',
  GET = 'get-user-images-menu',
}

// Menu actions
export enum CommonActions {
  GO_TO_CHAT = 'go-to-chat-action',
}

export enum AdminMenuActions {
  GO_TO_MENU = 'go-to-admin-menu-action',
}

export enum UsersMenuActions {
  ADD_NEW_USER = 'add-new-users-action',
  ADD_NEW_MULTIPLE_USERS = 'add-multiple-users-action',
}

export enum ModeratorMenuActions {
  GO_TO_MENU = 'go-to-moderator-menu-action',
}

export enum UserImagesMenuActions {
  CREATE_IMAGE = 'create-image-action',
}
