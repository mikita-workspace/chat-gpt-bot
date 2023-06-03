import { GITHUB_API, TELEGRAM_API } from '@bot/constants';

export const getFileTelegramApiLink = (token: string, filepath: string) =>
  `${TELEGRAM_API}/file/bot${token}/${filepath}`;

export const latestReleaseGithubApiLink = (owner: string, repo: string) =>
  `${GITHUB_API}/repos/${owner}/${repo}/releases/latest`;
