import { UserImageModel } from '@bot/models';
import { logger } from '@bot/services';
import { UserImageModelType } from '@bot/types';
import { fetchCachedData, setValueToMemoryCache } from '@bot/utils';

export class UserImagesService {
  async getAllUserImages(): Promise<UserImageModelType[]> {
    try {
      const userImages = await fetchCachedData('cached-user-images', async () =>
        UserImageModel.find({}).sort({ username: 1 }).exec(),
      );

      return userImages ?? [];
    } catch (error) {
      logger.error(`mongoService::getAllUserImages::${JSON.stringify(error.message)}`);

      return [];
    }
  }

  async getUserImages(username: string): Promise<UserImageModelType | null> {
    try {
      const userImages = await fetchCachedData(`cached-user-images-${username}`, async () =>
        UserImageModel.findOne({
          username,
        }).exec(),
      );

      return userImages;
    } catch (error) {
      logger.error(`mongoService::UserImagesService::${JSON.stringify(error.message)}`);

      return null;
    }
  }

  async setUserImages(
    username: string,
    images: { prompt: string; imageLinks: string[] },
  ): Promise<void> {
    try {
      const userImages = await this.getUserImages(username);

      const updatedUserImages = !userImages
        ? await UserImageModel.create({ username, images })
        : await UserImageModel.findOneAndUpdate(
            { username },
            { images: [...userImages.images, images] },
            { new: true },
          );

      setValueToMemoryCache(`cached-user-images-${username}`, JSON.stringify(updatedUserImages));
    } catch (error) {
      logger.error(`mongoService::setUserImages::${JSON.stringify(error.message)}`);
    }
  }
}
