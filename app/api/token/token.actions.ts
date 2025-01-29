import logger from '../../logger';
import { deleteApiTokenByUser, insertApiToken } from './token.service';
import { generateRandomToken } from '../../crypto';

export const generateToken = async (
  username: string,
  description?: string,
  isAdmin = false,
  isModerator = false
) => {
  try {
    const newToken = generateRandomToken();

    if (!newToken) {
      throw 'Error while creating token';
    }

    const dbResponse = await insertApiToken({
      token: newToken,
      username: username,
      description: description,
      isAdmin: isAdmin,
      isModerator: isModerator,
    });

    if (!dbResponse || !dbResponse?.id || !dbResponse?.createdAt || !dbResponse?.token) {
      throw 'Error while writing token in database';
    }

    return {
      id: dbResponse.id,
      token: dbResponse.token,
      username: dbResponse.username,
      createdAt: dbResponse.createdAt,
    };
  } catch (err) {
    logger.error('Creating token request:', err);
    throw err;
  }
};

export const deleteToken = async (username: string) => {
  try {
    const dbResponse = await deleteApiTokenByUser(username);

    if (!dbResponse || !dbResponse?.token) {
      throw 'Error while removing token from db';
    }

    return {
      result: 'Token removed',
      id: dbResponse.id,
      username: dbResponse.username,
      removedToken: dbResponse.token,
      removedAt: Date.now(),
    };
  } catch (err) {
    logger.error('Removing token request:', err);
    throw err;
  }
};
