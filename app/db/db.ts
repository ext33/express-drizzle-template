import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DB_HOST, DB_USER, DB_NAME, DB_PASSWORD, DB_PORT } from '../constants';

import * as tokenSchema from '../api/token/token.models';
import * as userSchema from '../api/auth/auth.models';
import logger from '../logger';
import { initDatabase } from './initDatabase';

const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

client.connect();

const db = drizzle(client, { schema: { ...tokenSchema, ...userSchema } });
logger.info('Database connected');

initDatabase(db);

export { db, client };
