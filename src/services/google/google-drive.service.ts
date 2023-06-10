import { config } from '@bot/config';
import { createReadStream } from 'fs';
import { google } from 'googleapis';

class GoogleDriveService {
  private driveClient;

  constructor(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
    this.driveClient = this.createDriveClient(clientId, clientSecret, redirectUri, refreshToken);
  }

  createDriveClient(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    refreshToken: string,
  ) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    client.setCredentials({ refresh_token: refreshToken });

    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  async createFolder(folderName: string, parentFolderId?: string) {
    const response = await this.driveClient.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        ...(parentFolderId && { parents: [parentFolderId] }),
      },
    });

    return response.data;
  }

  async searchFolder(folderName: string, parentFolderId?: string) {
    const response = await this.driveClient.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' ${
        parentFolderId ? ` and parents in '${parentFolderId}'` : ''
      }`,
      fields: 'files(id, name)',
    });

    return response.data;
  }

  async saveFile(fileName: string, filePath: string, fileMimeType: string, folderId?: string) {
    const response = await this.driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: createReadStream(filePath),
      },
      fields: 'id, webViewLink',
    });

    return response.data;
  }
}

export const googleDrive = new GoogleDriveService(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_ID,
  config.GOOGLE_DRIVE_REFRESH_TOKEN,
);
