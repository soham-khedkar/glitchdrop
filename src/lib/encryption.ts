import CryptoJS from 'crypto-js';

export const encryptFile = (file: ArrayBuffer, key: string): string => {
  const wordArray = CryptoJS.lib.WordArray.create(file);
  return CryptoJS.AES.encrypt(wordArray, key).toString();
};

export const decryptFile = (encrypted: string, key: string): ArrayBuffer => {
  const decrypted = CryptoJS.AES.decrypt(encrypted, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const generateKey = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString();
};