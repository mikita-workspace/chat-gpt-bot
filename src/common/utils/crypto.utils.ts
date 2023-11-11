import CryptoJS from 'crypto-js';

export const encrypt = <T>(data: T, secret: string) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();

export const decrypt = (cipherText: string, secret: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);

  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
