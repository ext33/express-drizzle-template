import { eq, like, or } from 'drizzle-orm';
import { db } from '../../db/db';
import { users } from './auth.models';

export type TNewUser = typeof users.$inferInsert;
export type TUserUpdate = typeof users.$inferInsert;

export const getUsers = async (search?: string) => {
  const rows = await db.query.users.findMany({
    where: search
      ? or(like(users.email, `%${search}%`), like(users.name, `%${search}%`))
      : undefined,
  });

  return rows;
};

export const getUserById = async (id: string) => {
  const row = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  return row;
};

export const getUserByEmail = async (email: string) => {
  const row = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return row;
};

export const createUser = async (userInsert: TNewUser) => {
  const [row] = await db.insert(users).values(userInsert).onConflictDoNothing().returning();

  return row;
};

export const updateUser = async (id: string, userUpdate: TUserUpdate) => {
  const [row] = await db.update(users).set(userUpdate).where(eq(users.id, id)).returning();

  return row;
};

export const softDeleteUser = async (id: string) => {
  const [row] = await db
    .update(users)
    .set({ deletedAt: new Date(), active: false })
    .where(eq(users.id, id))
    .returning();

  return row;
};
