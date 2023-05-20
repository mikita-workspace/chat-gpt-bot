import {
  adminMainMenu,
  blockUnblockUserMenu,
  conversationsMenu,
  deleteUserConversationMenu,
  deleteUserMenu,
  deleteUserSessionMenu,
  getUserConversationMenu,
  getUserSessionMenu,
  sessionsMenu,
  usersMenu,
} from '@bot/menu';
import { BotContextType } from '@bot/types';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

[
  blockUnblockUserMenu,
  conversationsMenu,
  deleteUserConversationMenu,
  deleteUserMenu,
  deleteUserSessionMenu,
  getUserConversationMenu,
  getUserSessionMenu,
  sessionsMenu,
  usersMenu,
].forEach((subMenu) => adminMainMenu.register(subMenu));

composer.use(adminMainMenu);

export const menuComposer = (): Middleware<BotContextType> => composer;
