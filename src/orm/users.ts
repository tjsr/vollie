import * as drizzleUsers from './drizzle/queries/users.js';

import { DBType } from './types.js';
import { PartialUser } from '../model/entity.js';

export const selectUserById = async (
  db: DBType, id: number
): Promise<PartialUser|undefined> => drizzleUsers.selectUserById(db, id);
  // .then((user) => {
  //   return {
  //     ...user,
  //   }
  // });
