import { text, uuid, timestamp, pgTable, boolean } from 'drizzle-orm/pg-core';

export const apiTokens = pgTable('api_tokens', {
  id: uuid('id').unique().primaryKey().defaultRandom(),
  token: text('token').unique().notNull(),
  username: text('username').unique().notNull(),
  description: text('description'),
  isAdmin: boolean('is_admin').notNull().default(false),
  isModerator: boolean('is_moderator').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
