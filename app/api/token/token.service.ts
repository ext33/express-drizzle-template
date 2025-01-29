import { eq } from 'drizzle-orm';
import { db } from '../../db/db';
import { apiTokens } from './token.models';

export type TNewApiKey = typeof apiTokens.$inferInsert;

export const insertApiToken = async (apiTokenInsert: TNewApiKey) => {
  const rows = await db.insert(apiTokens).values(apiTokenInsert).onConflictDoNothing().returning();

  return rows[0];
};

export const getApiToken = async (username: string) => {
  const row = await db.query.apiTokens.findFirst({
    where: eq(apiTokens.username, username),
  });

  return row;
};

export const deleteApiTokenByUser = async (username: string) => {
  const rows = await db
    .delete(apiTokens)
    .where(eq(apiTokens.username, username))
    .returning({ id: apiTokens.id, token: apiTokens.token, username: apiTokens.username });

  return rows[0];
};

export const deleteApiToken = async (token: string) => {
  const rows = await db
    .delete(apiTokens)
    .where(eq(apiTokens.token, token))
    .returning({ id: apiTokens.id, token: apiTokens.token, username: apiTokens.username });

  return rows[0];
};
