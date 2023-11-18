import { unlink } from 'fs/promises';

export const isEmptyObject = (object: object) => Object.keys(object).length === 0;

export const getKeyByValue = (object: object, value: string) => {
  const indexOfObject = Object.values(object).indexOf(value as unknown as object);
  const key = Object.keys(object)[indexOfObject];

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

export const removeFile = async (path: string) => unlink(path);

export const chunkIntoN = <T>(arr: T[], n: number) =>
  arr.reduce<T[][]>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / n);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
