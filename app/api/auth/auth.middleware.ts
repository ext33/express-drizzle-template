import { NextFunction, Request, Response } from 'express';
import { verifyToken } from './jwt';
import { getUserById } from './auth.service';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers?.token;
  if (!token || typeof token !== 'string') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers?.token;

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const verified = await verifyToken(token);

  if (!verified || !verified.payload.sub) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await getUserById(verified.payload.sub);

  if (!user || !user.role || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};
