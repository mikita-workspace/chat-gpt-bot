import { unlink } from 'fs/promises';
import { oggConverter } from './oggConverter';
import { openAI } from './openai';

const removeFile = async (path: string) => {
  try {
    await unlink(path);
  } catch (error) {
    console.error(`ERROR::utils::removeFile::${(error as Error).message}`);
  }
};

export { removeFile, oggConverter, openAI };
