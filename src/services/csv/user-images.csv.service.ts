import { UserImagesCsvIds } from '@bot/constants';
import { mapUserImages } from '@bot/helpers';
import { csv } from '@bot/services';
import { UserImageModelType } from '@bot/types';

export class UserImagesCsvService {
  async createUserImagesCsv(userImages: UserImageModelType) {
    const userImagesHeader = [
      { id: UserImagesCsvIds.PROMPT, title: UserImagesCsvIds.PROMPT },
      { id: UserImagesCsvIds.DRIVE_LINKS, title: UserImagesCsvIds.DRIVE_LINKS },
    ];

    return csv.csvWriter(
      `${userImages.username}-images`,
      userImagesHeader,
      mapUserImages(userImages),
    );
  }
}
