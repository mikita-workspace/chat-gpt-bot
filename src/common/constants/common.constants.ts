export enum BotCommands {
  ABOUT = 'about',
  CHANGE_MODEL = 'change',
  IMAGE = 'image',
  PROFILE = 'profile',
  RESTART = 'restart',
  START = 'start',
  SUPPORT = 'support',
}

export const BotCommandsWithDescription = [
  { command: BotCommands.RESTART, i18nKey: 'command-restart' },
  { command: BotCommands.CHANGE_MODEL, i18nKey: 'command-change-model' },
  { command: BotCommands.IMAGE, i18nKey: 'command-image' },
  { command: BotCommands.PROFILE, i18nKey: 'command-profile' },
  { command: BotCommands.ABOUT, i18nKey: 'command-about' },
  { command: BotCommands.SUPPORT, i18nKey: 'command-support' },
];

export enum AuthActions {
  GET_AUTH = 'get_auth_action',
}

export enum VoteActions {
  LIKE = 'like-vote-action',
  DISLIKE = 'dislike-vote-action',
}
