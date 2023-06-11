import { UserImagesCsvIds } from '@bot/constants';
import { logger } from '@bot/services';
import { UserImageModelType } from '@bot/types';
import { InputFile } from 'grammy';
import Jimp from 'jimp';
import { resolve as resolvePath } from 'path';

export const convertBase64ToFiles = async (
  base64Images: { base64: string; filename: string }[],
) => {
  try {
    const imageFiles: { filePath: string; filePathForReply: InputFile }[] = [];

    const promises = base64Images.map(async ({ base64, filename }) => {
      const filePath = resolvePath(__dirname, '../../../assets', `${filename}.png`);
      const buffer = Buffer.from(base64, 'base64');

      const image = await Jimp.read(buffer);
      image.quality(5).write(filePath);
      imageFiles.push({ filePath, filePathForReply: new InputFile(filePath) });
    });

    return await Promise.all(promises).then(() => imageFiles);
  } catch (error) {
    logger.error(`helpers::user-images::convertBase64ToFiles::${JSON.stringify(error.message)}`);

    return [];
  }
};

export const mapUserImages = (userImages: UserImageModelType) =>
  userImages.images.map(({ prompt, imageLinks }) => ({
    [UserImagesCsvIds.PROMPT]: prompt,
    [UserImagesCsvIds.DRIVE_LINKS]: imageLinks.join(', '),
  }));
