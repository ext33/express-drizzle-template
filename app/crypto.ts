import crypto from 'crypto';
import { SECRET_KEY } from './constants';

const ALGORITHM = {
  /**
   * GCM is an authenticated encryption mode that
   * not only provides confidentiality but also
   * provides integrity in a secured way
   * */
  BLOCK_CIPHER: 'aes-256-gcm',

  /**
   * 128 bit auth tag is recommended for GCM
   */
  AUTH_TAG_BYTE_LEN: 16,

  /**
   * NIST recommends 96 bits or 12 bytes IV for GCM
   * to promote interoperability, efficiency, and
   * simplicity of design
   */
  IV_BYTE_LEN: 12,

  /**
   * Note: 256 (in algorithm name) is key size.
   * Block size for AES is always 128
   */
  KEY_BYTE_LEN: 32,

  /**
   * To prevent rainbow table attacks
   * */
  SALT_BYTE_LEN: 16,
};

const iv = crypto.randomBytes(ALGORITHM.IV_BYTE_LEN);

export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const encryptString = (string: string): string => {
  const cipher = crypto.createCipheriv(ALGORITHM.BLOCK_CIPHER, SECRET_KEY, iv);

  return cipher.update(string, 'utf8', 'hex') + cipher.final('hex');
};

export const decryptString = (string: string): string => {
  const decipher = crypto.createDecipheriv(ALGORITHM.BLOCK_CIPHER, SECRET_KEY, iv);

  return decipher.update(string, 'hex', 'utf8') + decipher.final('utf8');
};

export const hash = (string: string): string => {
  return crypto.createHash('sha256').update(string).digest('hex');
};

export const compare = (string: string, hash: string): boolean => {
  return crypto.createHash('sha256').update(string).digest('hex') === hash;
};
