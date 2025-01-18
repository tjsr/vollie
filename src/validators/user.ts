import { Existing, UserTO } from "../model/to";
import { selectUserById, validateCreateTO as validateUserCreateTO, validateUpdateTO as validateUserUpdateTO } from "../orm/users";

import { DBType } from "../orm/types";
import { User } from "../model/entity";
import { UserId } from "../model/id";
import { UserNotFoundError } from "../errors";
import { validateIdIfRequired } from "./id";

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

export const validateUserBody = async (
  _db: DBType,
  body: Record<string, unknown>,
  isNew: boolean
): Promise<UserTO> => {
  return validateIdIfRequired(body, isNew)
    .then(() => {
      const to: Partial<UserTO> = {
        ...body,
      };
      if (isNew) {
        validateUserCreateTO(to as UserTO);
      } else {
        validateUserUpdateTO(to as Existing<UserTO>); 
      }
      return to as UserTO;
    });
};
