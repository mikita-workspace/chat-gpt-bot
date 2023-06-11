import { config } from '@bot/config';
import { applyMixins } from '@bot/utils';
import { google as googleApi } from 'googleapis';

import { GoogleDriveService } from './google-drive.service';

class GoogleService {
  driveClient;

  constructor(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
    this.driveClient = this.createDriveClient(clientId, clientSecret, redirectUri, refreshToken);
  }

  createDriveClient(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    refreshToken: string,
  ) {
    const client = new googleApi.auth.OAuth2(clientId, clientSecret, redirectUri);
    client.setCredentials({ refresh_token: refreshToken });

    return googleApi.drive({
      version: 'v3',
      auth: client,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GoogleService extends GoogleDriveService {}

applyMixins(GoogleService, [GoogleDriveService]);

export const google = new GoogleService(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_ID,
  config.GOOGLE_DRIVE_REFRESH_TOKEN,
);
