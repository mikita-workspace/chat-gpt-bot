export type ClientLoggerModelType = {
  level: string;
  message: string;
  meta: { username: string; telegramId: number };
  timestamp: number;
};
