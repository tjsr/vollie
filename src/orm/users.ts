import * as drizzleUsers from './drizzle/queries/users.js';

import { User as DrizzleUser, UserTO, UsersTable } from './drizzle/schema/users.js';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';

import { DBType } from './types.js';
import { Existing } from '../model/to.js';
import { User } from '../model/entity.js';
import { UserId } from '../model/id.js';

const usersInsertSchema = createInsertSchema(UsersTable);
const usersUpdateSchema = createUpdateSchema(UsersTable);

// Users has no references to the TO is identical.
const usersInsertTO = createInsertSchema(UsersTable);
const usersUpdateTO = createUpdateSchema(UsersTable);

export const selectUserById = async (
  db: DBType, id: UserId
): Promise<User | undefined> => drizzleUsers.selectUserById(db, id)
    .then((user: DrizzleUser | undefined) => {
      if (user === undefined) {
        return undefined;
      }
      return {
        ...user,
      } as User;
    });

export const validateCreateTO = (data: UserTO): UserTO => {
  usersInsertTO.parse(data);
  return data;
};

export const validateUpdateTO = (data: Existing<UserTO>): UserTO => {
  usersUpdateTO.parse(data);
  if (data.id === undefined) {
    console.warn('Got UserTO update without an id', data);
    throw new Error('id is required to update a UserTO');
  }
  return data;
};

export const validateCreate = (data: User): User => {
  usersInsertSchema.parse(data);
  return data;
};

export const validateUpdate = (data: User): User => {
  usersUpdateSchema.parse(data);
  return data;
};

export const selectAllUsers = async (db: DBType): Promise<User[]> => drizzleUsers.selectAllUsers(db)
  .then((users: DrizzleUser[]) => users.map((user: DrizzleUser) => {
    return {
      ...user
    } as User;
  })
);
