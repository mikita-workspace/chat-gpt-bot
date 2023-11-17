import { DATE_FORMAT } from '@bot/common/constants';
import { formatDate } from '@bot/common/utils';
import { config } from '@bot/config';
import json2md from 'json2md';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiErrorPayload = (error: any) => {
  const { level, timestamp, context, message, stack } = error;

  return {
    attachments: [
      {
        color: '#f44336',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Level:*\n${level.toUpperCase()}\n\n*Source:*\n${context}\n\n*Happened at:*\n${formatDate(
                new Date(timestamp),
                DATE_FORMAT,
              )}`,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Message:*\n${message}\n\n*Stack:*\n${json2md([
                {
                  code: {
                    language: 'json',
                    content: JSON.stringify(stack),
                  },
                },
              ])}`,
            },
          },
        ],
      },
    ],
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Error in ${config.CLIENT_NAME}*`,
        },
      },
    ],
    text: `${config.CLIENT_NAME} Error`,
  };
};
