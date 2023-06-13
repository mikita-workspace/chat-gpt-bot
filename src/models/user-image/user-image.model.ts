import { UserImageModelType } from '@bot/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<UserImageModelType>({
  images: [],
  folderId: { type: String },
  username: { type: String, unique: true },
});

export const UserImageModel = model('UserImage', schema);
