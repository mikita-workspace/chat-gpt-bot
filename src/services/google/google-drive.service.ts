import { google, logger } from '@bot/services';
import archiver from 'archiver';
import { createReadStream, createWriteStream } from 'fs';
import { InputFile } from 'grammy';
import { resolve as resolvePath } from 'path';

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

  async downloadFolder(folderId: string, username: string) {
    try {
      const filePath = resolvePath(__dirname, '../../../assets', `${username}.zip`);

      const stream = createWriteStream(filePath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      stream.on('close', function () {
        logger.info(`googleDriveService::downloadFolder::${archive.pointer()} total bytes.`);
        logger.info(
          'googleDriveService::downloadFolder::archiver has been finalized and the output file descriptor has closed.',
        );
      });

      archive.pipe(stream);

      const fileList = await google.driveClient.files.list({
        q: `'${folderId}' in parents and trashed = false`,
      });

      for (const file of fileList.data.files ?? []) {
        const fileId = file.id;
        const fileName = file.name;

        if (fileId && fileName) {
          const fileStream = await google.driveClient.files.get(
            {
              fileId,
              alt: 'media',
            },
            { responseType: 'stream' },
          );

          archive.append(fileStream.data, { name: `${fileName}.png` });
        }
      }

      archive.finalize();

      return {
        filePath,
        filePathForReply: new InputFile(filePath),
      };
    } catch (error) {
      logger.error(`googleDriveService::downloadFolder::${JSON.stringify(error.message)}`);

      return {};
    }
  }
}
