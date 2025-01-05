import * as drizzleEvent from './drizzle/queries/raceevent.js';

import { DBType } from './types.js';
import { RaceEvent } from '../model/entity.js';

export const selectEvents = async (db: DBType): Promise<RaceEvent[]> => {
  return drizzleEvent.selectEvents(db);
};

