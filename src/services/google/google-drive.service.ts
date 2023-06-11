import { google, logger } from '@bot/services';
import { createReadStream } from 'fs';

export class GoogleDriveService {
  async createFolder(folderName: string, parentFolderId?: string) {
    try {
      const response = await google.driveClient.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          ...(parentFolderId && { parents: [parentFolderId] }),
        },
      });

      return response.data;
    } catch (error) {
      logger.error(`googleDriveService::createFolder::${JSON.stringify(error.message)}`);

      return {};
    }
  }

  async searchFolder(folderName: string, parentFolderId?: string) {
    try {
      const response = await google.driveClient.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' ${
          parentFolderId ? ` and parents in '${parentFolderId}'` : ''
        }`,
        fields: 'files(id, name)',
      });

      return response.data;
    } catch (error) {
      logger.error(`googleDriveService::searchFolder::${JSON.stringify(error.message)}`);

      return {};
    }
  }

  async saveFiles(
    files: { fileName: string; filePath: string; fileMimeType: string }[],
    folderId?: string,
  ) {
    try {
      const promises = files.map(async ({ fileName, filePath, fileMimeType }) =>
        google.driveClient.files.create({
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
        }),
      );

      return await Promise.all(promises).then((responses) =>
        responses.map((response) => response.data),
      );
    } catch (error) {
      logger.error(`googleDriveService::saveFiles::${JSON.stringify(error.message)}`);

      return [];
    }
  }
}
