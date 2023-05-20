import { adminMenu, adminSubMenu } from '@bot/menu';
import { BotContextType } from '@bot/types';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

adminSubMenu.forEach((subMenu) => adminMenu.register(subMenu));

composer.use(adminMenu);

export const menuComposer = (): Middleware<BotContextType> => composer;
