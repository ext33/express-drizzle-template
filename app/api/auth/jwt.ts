import { SignJWT, jwtVerify } from 'jose';
import { SECRET_KEY, JWT_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN } from '../../constants';
import { getUserById } from './auth.service';

const JWT_SECRET = new TextEncoder().encode(SECRET_KEY);

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function generateToken(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_TOKEN_EXPIRES_IN)
    .setIssuedAt()
    .sign(JWT_SECRET);

  const refreshToken = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_REFRESH_TOKEN_EXPIRES_IN)
    .setIssuedAt()
    .sign(JWT_SECRET);

  return { token, refreshToken };
}

export async function refreshToken(refreshToken: string) {
  const verified = await verifyToken(refreshToken);
  const userId = verified.payload.sub;

  if (!userId) {
    throw new AuthError('Invalid token');
  }

  const user = await getUserById(userId);
  if (!user) {
    throw new AuthError('User not found');
  }

  return generateToken(userId);
}

export async function verifyToken(token: string) {
  return jwtVerify(token, JWT_SECRET);
}
