import { defineConfig } from 'drizzle-kit';

let missingEnv = false;
['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_DATABASE_ID', 'CLOUDFLARE_D1_TOKEN'].forEach((key) => {
  if (process.env[key] === undefined) {
    console.error(`${key} is not set.  Configure this in .env`);
    missingEnv = true;
  }
});

if (missingEnv) {
  process.exit(1);
}

export default defineConfig({
  schema: './src/orm/drizzle/schema/index.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  out: './drizzle',
  migrations: {
    schema: './src/sql/schema.sql',
  },
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
