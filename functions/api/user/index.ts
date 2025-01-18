import { ApiModelContext, generateOnRequest } from "../generic";
import { createUser, updateUser } from "../../../src/orm/drizzle/queries/users";

import { Env } from "../../types";
import { UserId } from "../../../src/model/id";
import { UserTO } from "../../../src/model/to";
import { selectUserById } from "../../../src/orm/users";
import { validateUserBody } from "../../../src/validators/user";

type UserIdKey = 'userId';

const api: ApiModelContext<UserTO, UserId> = {
  entrypoint: '/user',
  idParam: 'userId',
  // validateId: validateUserId,
  validateBody: validateUserBody,
  create: createUser,
  select: selectUserById,
  update: updateUser,
};

export const onRequest: PagesFunction<Env> = generateOnRequest<UserId, UserTO, UserIdKey>(api);
