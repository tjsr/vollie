import { UsersTable } from "../schema";
import { VollieDatabaseError } from "../../errors";
import { VollieDrizzleConnection } from "../../types";
import { eq } from "drizzle-orm";
import { User, UserTO } from "../schema/users.js";
import { CreateFunction } from "../../../functionUtils";
import { Existing, Uninitialised } from "../../../model/to";

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

export const createUser: CreateFunction<UserTO> = async (db: VollieDrizzleConnection, users: Uninitialised<UserTO>): Promise<Existing<UserTO>> => {
  return db.insert(UsersTable).values(users).returning().then((result) => {
    if (result.length > 1) {
      throw new Error('Returned multiple results from insert');
    }
    console.log(`Created series with id ${result[0].id}`);
    return result[0];
  });
};
