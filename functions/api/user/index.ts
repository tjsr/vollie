import { ApiModelContext, generateOnRequest, validateIdIfRequired } from "../generic";
import { Existing, UserTO } from "../../../src/model/to";
import { createUser, updateUser } from "../../../src/orm/drizzle/queries/users";
import { selectUserById, validateCreateTO as validateUserCreateTO, validateUpdateTO as validateUserUpdateTO } from "../../../src/orm/users";

import { DBType } from "../../../src/orm/types";
import { Env } from "../../../src/functionUtils";
import { UserId } from "../../../src/model/id";

type UserIdKey = 'userId';

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

// export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
//   console.log('/event entrypoint: ', context.request.url);
//   try {
//     if (context.request.headers.get('content-type') !== 'application/json') {
//       return onHtmlRequest(context);
//     }
//     if (context.request.method === 'POST') {
//       return onJsonRequestPost(context);
//     } else if (context.request.method === 'PUT') {
//       return onJsonRequestPut(context);
//     } else {
//       return onJsonRequestGet(context);
//     }
//   } catch (err) {
//     console.error(err);
//     return Response.error();
//   }
// };

