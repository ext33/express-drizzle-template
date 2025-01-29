import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/api/**/*.models.ts',
  out: './app/db/migrations',
  dbCredentials: {
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'swap-db',
    password: process.env.DB_PASSWORD || 'qtgdq63h23gHg32',
    ssl: false,
  },
});
