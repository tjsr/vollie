import { Existing, Uninitialised } from "../../../model/to";
import { User, UserTO } from "../schema/users.js";

import { CreateFunction } from "./types.js";
import { UserId } from "../../../model/id.js";
import { UsersTable } from "../schema";
import { VollieDatabaseError } from "../../errors";
import { VollieDrizzleConnection } from "../types";
import { eq } from "drizzle-orm";
import { safeCheckAndCopy } from "./utils.js";

const userSelect = (db: VollieDrizzleConnection) => db
  .select({ users: UsersTable })
  .from(UsersTable);

type UserSelectByIdResult = Awaited<ReturnType<typeof userSelectById>>;
type UserSelectByIdResultItem = UserSelectByIdResult extends Array<infer U> ? U : never;

const userSelectToUserType = (result: UserSelectByIdResultItem): User => ({
  ...result.users,
});

const userSelectById = (db: VollieDrizzleConnection, id: number) => userSelect(db).where(eq(UsersTable.id, id));
const userSelectAll = (db: VollieDrizzleConnection) => db.query.UsersTable.findMany();

export const selectUserById = async (db: VollieDrizzleConnection, id: number): Promise<User|undefined> => {
  const resultPromise = userSelectById(db, id).then((result) => {
    if (result.length > 1) {
      throw new VollieDatabaseError(`Database query for event with id ${id} returned more than one result`);
    }
  
    if (result.length === 0) {
      return undefined;
    }
    const user: User = userSelectToUserType(result[0]);
    return user;
  });
  
  return resultPromise;
};

export const selectAllUsers = async (db: VollieDrizzleConnection): Promise<User[]> => 
  userSelectAll(db);

export const createUser: CreateFunction<UserTO> = async (db: VollieDrizzleConnection, user: Uninitialised<UserTO>): Promise<Existing<UserTO>> => {
  return db.insert(UsersTable).values(user).returning().then((result) => {
    if (result.length > 1) {
      throw new Error(`Returned multiple results from insert when creating ${JSON.stringify(user)}`);
    }
    console.log(`Created user with id ${result[0].id}`);
    return result[0];
  });
};

export const updateUser = async (db: VollieDrizzleConnection, user: Existing<UserTO>): Promise<UserId> => {
  const updateOrganisation: Partial<UserTO> = safeCheckAndCopy(user,
    ['firstName', 'lastName', 'email', 'phone']
  );
  return db.update(UsersTable)
    .set(updateOrganisation)
    .where(eq(UsersTable.id, updateOrganisation.id!))
    .returning({ id: UsersTable.id })
    .then((result) => {
      if (result.length > 1) {
        throw new Error('Returned multiple results from insert');
      }
      return result[0].id;
    }).catch((err) => {
      console.error(updateUser, 'Error updating user', err, user);
      throw err;
    });
};
