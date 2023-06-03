import { AdminMenu, ModeratorMenu } from '@bot/constants';
import {
  adminMainMenu,
  blockUnblockUserMenu,
  changeUserGptLimitsMenu,
  changeUserRoleMenu,
  conversationsMenu,
  deleteUserConversationMenu,
  deleteUserMenu,
  deleteUserSessionMenu,
  getUserConversationMenu,
  getUserSessionMenu,
  moderatorMainMenu,
  selectNewGptLimits,
  selectNewUserRoleMenu,
  sessionsMenu,
  usersMenu,
} from '@bot/menu';
import { BotContextType } from '@bot/types';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

[
  blockUnblockUserMenu,
  changeUserGptLimitsMenu,
  changeUserRoleMenu,
  conversationsMenu,
  deleteUserConversationMenu,
  deleteUserMenu,
  deleteUserSessionMenu,
  getUserConversationMenu,
  getUserSessionMenu,
  selectNewUserRoleMenu,
  selectNewGptLimits,
  sessionsMenu,
  usersMenu,
].forEach((subMenu) => adminMainMenu.register(subMenu(AdminMenu.NAME)));

[blockUnblockUserMenu, getUserSessionMenu, sessionsMenu, usersMenu].forEach((subMenu) =>
  moderatorMainMenu.register(subMenu(ModeratorMenu.NAME)),
);

composer.use(adminMainMenu);
composer.use(moderatorMainMenu);

export const menuComposer = (): Middleware<BotContextType> => composer;
