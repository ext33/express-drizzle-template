import { Request, Response, NextFunction } from 'express';
import { getApiToken } from './token.service';

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers?.token;
    const authUsername = req.headers?.username;

    if (
      !authToken ||
      !authUsername ||
      typeof authToken !== 'string' ||
      typeof authUsername !== 'string'
    ) {
      return res.status(404).send();
    }

    const tokenFromDatabase = await getApiToken(authUsername);

    if (
      !tokenFromDatabase ||
      authToken !== tokenFromDatabase?.token ||
      !tokenFromDatabase?.isAdmin
    ) {
      return res.status(404).send();
    }

    return next();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers?.token;
    const authUsername = req.headers?.username;

    if (
      !authToken ||
      !authUsername ||
      typeof authToken !== 'string' ||
      typeof authUsername !== 'string'
    ) {
      return res.status(403).json({ error: 'Auth not provided' });
    }

    const tokenFromDatabase = await getApiToken(authUsername);

    if (!tokenFromDatabase || authToken !== tokenFromDatabase?.token) {
      return res.status(403).json({ error: 'Your auth is not valid' });
    }

    return next();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
