import { TTL_DEFAULT } from '@bot/constants';
import { logger } from '@bot/services';
import { unlink } from 'fs/promises';
import Jimp from 'jimp';
import NodeCache from 'node-cache';
import { resolve as resolvePath } from 'path';

export const memoryCache = new NodeCache({
  stdTTL: TTL_DEFAULT,
});

export const setValueToMemoryCache = (key: string, value: string, expires = TTL_DEFAULT) =>
  memoryCache.set(key, value, expires);

export const removeValueFromMemoryCache = (key: string) => memoryCache.del(key);

export const getValueFromMemoryCache = (key: string) => memoryCache.get<string>(key);

export const fetchCachedData = async <T>(key: string, dataCallback: () => T) => {
  const cachedData = getValueFromMemoryCache(key);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const response = await dataCallback();

  setValueToMemoryCache(key, JSON.stringify(response));

  return response;
};

export const removeFile = async (path: string) => {
  try {
    await unlink(path);
  } catch (error) {
    logger.error(`util::removeFile::${JSON.stringify(error.message)}`);
  }
};

export const isEmptyObject = (object: object) => Object.keys(object).length === 0;

export const getKeyByValue = (object: object, value: string) => {
  const indexOfS = Object.values(object).indexOf(value as unknown as object);
  const key = Object.keys(object)[indexOfS];

  return key;
};

export const uniqBy = <T>(arr: T[], key: keyof T): T[] =>
  Object.values(
    arr.reduce(
      (map, item) => ({
        ...map,
        [`${item[key]}`]: item,
      }),
      {},
    ),
  );

export const parseTimestampUTC = (timestamp: number | string | Date) => {
  const date = new Date(timestamp);

  return date.toUTCString();
};

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

// Source: https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const applyMixins = (derivedCtor: any, constructors: any[]) => {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
      );
    });
  });
};

export const convertBase64ToFiles = async (base64Images: string[], filename: string) => {
  try {
    const imageFiles: string[] = [];

    const promises = base64Images.map(async (base64Image, index) => {
      const imagePath = resolvePath(__dirname, '../../assets', `${filename}-${index}.png`);
      const buffer = Buffer.from(base64Image, 'base64');

      const image = await Jimp.read(buffer);
      image.quality(5).write(imagePath);
      imageFiles.push(imagePath);
    });

    return await Promise.all(promises).then(() => imageFiles);
  } catch (error) {
    logger.error(`utils::convertBase64ToFiles::${JSON.stringify(error.message)}`);

    return [];
  }
};
