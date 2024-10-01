import * as drizzleEvent from './drizzle/queries/raceevent.js';

import { RaceEvent } from '../model/entity.js';
import { VollieDrizzleConnection } from '../types.js';

type DBType = VollieDrizzleConnection;

export const selectEvents = async (db: DBType): Promise<RaceEvent[]> => {
  return drizzleEvent.selectEvents(db);
};

