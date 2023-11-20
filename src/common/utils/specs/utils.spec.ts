import { DAY_MS } from '@bot/common/constants';
import { Logger } from '@bot/services';
import { Logger as WinstonLogger } from 'winston';

import {
  fetchCachedData,
  memoryCache,
  removeValueFromMemoryCache,
  setValueToMemoryCache,
} from '../cache.utils';
import { capitalize, getKeyByValue, isEmptyObject, uniqBy } from '../common.utils';
import { decrypt, encrypt } from '../crypto.utils';
import { getTimestampUnix, isExpiredDate } from '../date.utils';

jest.spyOn(Logger, 'error').mockReturnValue({} as unknown as WinstonLogger);

describe('util >> memory cache', () => {
  const key = 'testKey';
  const value = 'testValue';

  beforeEach(() => {
    jest.resetModules();
    memoryCache.del(key);
  });

  it('sets a key-value pair in the memory cache', () => {
    const expires = 3600; // 1 hour expiry

    setValueToMemoryCache(key, value, expires);

    const result = memoryCache.get(key);

    expect(result).toEqual(value);
  });

  it('sets a key-value pair in the memory cache with default expiry time', () => {
    setValueToMemoryCache(key, value);

    const result = memoryCache.get(key);

    expect(result).toEqual(value);
  });

  it('returns cached data if it exists', async () => {
    const data = { foo: 'bar' };
    const callback = jest.fn(() => JSON.stringify(data));

    const result = await fetchCachedData(key, callback);

    expect(result).toEqual(JSON.stringify(data));
  });

  it('calls callback and stores result in cache if no cached data exists', async () => {
    const data = { bar: 'baz' };
    const callback = jest.fn(() => Promise.resolve(data));

    const result = await fetchCachedData(key, callback);

    expect(result).toEqual(data);
  });

  it('remove a key-value pair in the memory cache', () => {
    setValueToMemoryCache(key, value);

    const result = removeValueFromMemoryCache(key);

    expect(result).toEqual(1);
  });
});

describe('util >> isEmptyObject', () => {
  it('should return true for empty object', () => {
    const emptyObject = {};
    expect(isEmptyObject(emptyObject)).toBe(true);
  });

  it('should return false for non-empty object', () => {
    const nonEmptyObject = { a: 1 };
    expect(isEmptyObject(nonEmptyObject)).toBe(false);
  });
});

describe('util >> getKeyByValue', () => {
  const object = { x: '1', y: '2', z: '3' };

  it('returns "x" when the value is 1', () => {
    expect(getKeyByValue(object, '1')).toBe('x');
  });

  it('returns "z" when the value is 3', () => {
    expect(getKeyByValue(object, '3')).toBe('z');
  });

  it('returns undefined when the value does not exist in the object', () => {
    expect(getKeyByValue(object, '4')).toBeUndefined();
  });
});

describe('util >> uniqBy', () => {
  it('should return an array with unique objects based on the given key', () => {
    const arr = [
      { id: 1, name: 'Jack' },
      { id: 2, name: 'Jane' },
      { id: 1, name: 'Jack' },
      { id: 3, name: 'Mary' },
    ];

    expect(uniqBy(arr, 'id')).toEqual([
      { id: 1, name: 'Jack' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Mary' },
    ]);
  });

  it('should return an empty array when provided an empty array', () => {
    expect(uniqBy([], 'id')).toEqual([]);
  });
});

describe('util >> getTimestampUnix', () => {
  it('should return a number in Unix format', () => {
    const input = new Date('2021-08-31T13:45:00Z');
    const expectedOutput = 1630417500;

    const output = getTimestampUnix(input);

    expect(output).toBe(expectedOutput);
  });

  it('should return a number in Unix format when passed a timestamp as string', () => {
    const input = '2021-08-31T13:45:00Z';
    const expectedOutput = 1630417500;

    const output = getTimestampUnix(input);

    expect(output).toBe(expectedOutput);
  });

  it('should return a string in Unix format when passed a timestamp as number', () => {
    const input = 1630433100000;
    const expectedOutput = 1630433100;

    const output = getTimestampUnix(input);

    expect(output).toBe(expectedOutput);
  });
});

describe('util >> isExpiredDate', () => {
  it('returns True if passed date is expired', () => {
    expect(isExpiredDate(getTimestampUnix(new Date()) - DAY_MS)).toEqual(true);
  });

  it('returns False if passed date is not expired', () => {
    expect(isExpiredDate(getTimestampUnix(new Date()) + DAY_MS)).toEqual(false);
  });
});

describe('util >> capitalize', () => {
  it('should capitalize the first character', () => {
    const result = capitalize('hello');
    expect(result.charAt(0)).toEqual('H');
  });

  it('should make the rest of the characters lowercase', () => {
    const result = capitalize('HeLLo');
    expect(result).toEqual('Hello');
  });
});

describe('util >> AES encryption', () => {
  const text = 'abc123';
  const object = { a: 1, b: 2 };
  const secret = 'secret';

  it('text should be encrypted and decrypted', () => {
    const cipherText = encrypt(text, secret);
    const decryptedText = decrypt(cipherText, secret);

    expect(decryptedText).toEqual(text);
  });

  it('object should be encrypted and decrypted', () => {
    const cipherObject = encrypt(object, secret);
    const decryptedObject = decrypt(cipherObject, secret);

    expect(decryptedObject).toMatchObject(object);
  });
});
