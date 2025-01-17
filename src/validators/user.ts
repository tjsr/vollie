import { DBType } from "../orm/types";
import { User } from "../model/entity";
import { UserId } from "../model/id";
import { UserNotFoundError } from "../errors";
import { selectUserById } from "../orm/users";

export const validateUserExists = (db: DBType, id: UserId): Promise<User> => {
  return selectUserById(db, id)
    .then((user) => {
      if (user) {
        return {
          ...user
        } as User;
      }
      throw new UserNotFoundError(`User ${id} not found`);
    });
};
