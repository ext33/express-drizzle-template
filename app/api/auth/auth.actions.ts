import { compare, hash } from '../../crypto';
import { AuthError, generateToken, verifyToken, refreshToken } from './jwt';
import {
  getUserByEmail,
  createUser,
  getUserById,
  updateUser,
  softDeleteUser,
} from './auth.service';
import type { TNewUser, TUserUpdate } from './auth.service';

export async function register(email: string, password: string, name: string) {
  const hashedPassword = await hash(password);

  try {
    const newUser: TNewUser = {
      email,
      password: hashedPassword,
      name,
    };

    const user = await createUser(newUser);

    if (!user) {
      throw new AuthError('Не удалось создать пользователя');
    }

    return { user };
  } catch (error) {
    throw new AuthError('Пользователь с таким email уже существует');
  }
}

export async function login(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new AuthError('Неверный email или пароль');
  }

  const isValidPassword = await compare(password, user.password);

  if (!isValidPassword) {
    throw new AuthError('Неверный email или пароль');
  }

  const token = await generateToken(user.id);

  const { ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

export async function refresh(refresh: string) {
  const refreshPayload = await refreshToken(refresh);
  return refreshPayload;
}

export async function updateProfile(userId: string, data: Partial<Omit<TUserUpdate, 'id'>>) {
  const user = await getUserById(userId);

  if (!user) {
    throw new AuthError('Пользователь не найден');
  }

  if (data.password) {
    data.password = await hash(data.password);
  }

  const updatedUser = await updateUser(userId, data as TUserUpdate);

  if (!updatedUser) {
    throw new AuthError('Не удалось обновить профиль');
  }

  const { ...userWithoutPassword } = updatedUser;
  return { user: userWithoutPassword };
}

export async function softDeleteAccount(userId: string) {
  const user = await getUserById(userId);

  if (!user) {
    throw new AuthError('Пользователь не найден');
  }

  const deletedUser = await softDeleteUser(userId);

  if (!deletedUser) {
    throw new AuthError('Не удалось удалить аккаунт');
  }

  return { success: true };
}

export async function getCurrentUser(token: string) {
  if (!token) {
    return null;
  }

  try {
    const verified = await verifyToken(token);
    const userId = verified.payload.sub;

    if (!userId) {
      return null;
    }

    const user = await getUserById(userId);
    if (!user) {
      return null;
    }

    const { ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    return null;
  }
}
