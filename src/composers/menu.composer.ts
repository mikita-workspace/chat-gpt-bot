import {
  adminDynamicUsersForDeleteSessionsMenu,
  adminDynamicUsersForSessionsMenu,
  adminDynamicUsersMenu,
  adminMainMenu,
  adminSessionsMenu,
  adminUsersMenu,
} from '@bot/menu';
import { BotContextType } from '@bot/types';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

adminMainMenu.register(adminSessionsMenu);
adminMainMenu.register(adminUsersMenu);
adminMainMenu.register(adminDynamicUsersMenu);
adminMainMenu.register(adminDynamicUsersForSessionsMenu);
adminMainMenu.register(adminDynamicUsersForDeleteSessionsMenu);

composer.use(adminMainMenu);

export const menuComposer = (): Middleware<BotContextType> => composer;
