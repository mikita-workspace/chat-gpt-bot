export type ClientLoggerModelType = {
  level: string;
  message: string;
  meta: { username: string };
  timestamp: number;
};
