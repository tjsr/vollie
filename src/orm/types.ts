import * as VollieDrizzleSchema from './drizzle/schema/index.js';

import { DrizzleD1Database } from 'drizzle-orm/d1';

export type VollieDrizzleConnection = DrizzleD1Database<typeof VollieDrizzleSchema>;