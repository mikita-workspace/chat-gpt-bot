import { unlink } from 'fs/promises';

export const removeFile = async (path: string) => {
  try {
    await unlink(path);
  } catch (error) {
    console.error(`ERROR::util::removeFile::${(error as Error).message}`);
  }
};

export const isEmptyObject = (object: object) =>
  Object.keys(object).length === 0;

export const mapContextData = (from: any) => ({
  telegramId: from.id,
  username: from.username,
  firstname: from.first_name,
});
