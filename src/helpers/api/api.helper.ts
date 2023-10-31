import { APIs } from '@bot/constants';

export const getFileTelegramApiLink = (token: string, filepath: string) =>
  `${APIs.TELEGRAM}/file/bot${token}/${filepath}`;

export const latestReleaseGithubApiLink = (owner: string, repo: string) =>
  `${APIs.GITHUB}/repos/${owner}/${repo}/releases/latest`;
