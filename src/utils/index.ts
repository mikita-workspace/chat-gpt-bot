import { unlink } from 'fs/promises';

export const removeFile = async (path: string) => {
  try {
    await unlink(path);
  } catch (error) {
    console.error(`ERROR::utils::removeFile::${(error as Error).message}`);
  }
};
