import { ADMIN_USERNAME } from '../constants';
import logger from '../logger';
import { generateRandomToken } from '../crypto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { apiTokens } from '../api/token/token.models';

export const initDatabase = async (db: NodePgDatabase<any>) => {
  try {
    const username = ADMIN_USERNAME;
    const newToken = generateRandomToken();

    if (!newToken || !username) {
      throw 'Error while creating token';
    }

    const rows = await db
      .insert(apiTokens)
      .values({ username: username, token: newToken, isAdmin: true, isModerator: true })
      .onConflictDoNothing()
      .returning();

    logger.info(
      rows[0]?.token ? `Admin token created: ${rows[0]?.token}` : 'Admin token already exist'
    );
  } catch (err) {
    logger.error(err);
  }
};
