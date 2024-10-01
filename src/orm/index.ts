import * as VollieDrizzleSchema from "./drizzle/schema/index.js";

import { Env } from "../types";
import { VollieDrizzleConnection } from "./types";
import { drizzle } from "drizzle-orm/d1";

export const getDbConnection = (db: D1Database): VollieDrizzleConnection => {
  const drizzleDb: VollieDrizzleConnection = drizzle(db, { schema: VollieDrizzleSchema });
  return drizzleDb;
};

export const getDbConnectionFromEnv = (env: Env): VollieDrizzleConnection => {
  if (env.VOLLIE_DB === undefined) {
    throw new Error('No database connection.  Check that the VOLLIE_DB binding is set in wrangler.toml');
  }
  return getDbConnection(env.VOLLIE_DB);
};
