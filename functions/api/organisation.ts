import { Env, notAllowedMethodHandler, onHtmlRequest, resultForModelObject } from "../../src/functionUtils";
import { OrganisationId, UserId, validateId } from "../../src/model/id";
import { createOrganisation, selectOrganisationById, updateOrganisation } from "../../src/orm/drizzle/queries/organistion";
import { processGenericPost, processGenericPut, validateIdIfRequired } from "./generic.js";

import { DBType } from "../../src/orm/types.js";
import { OrganisationTO } from "../../src/model/to";
import { User } from "../../src/model/entity";
import { VollieDrizzleConnection } from "../../src/types";
import { getDbConnectionFromEnv } from "../../src/orm";
import { onJsonRequestGet as onJsonRequestGetAll } from './organisations';
import { selectUserById } from "../../src/orm/users.js";
import { validateOrganisationTO } from "../../src/model/organisation";

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

/**
 * @throws ValidationError
 */
export const validateOrganisationBody = async (db: DBType, body: Record<string, unknown>, newObject: boolean): Promise<OrganisationTO> => {
  const to: Partial<OrganisationTO> = {
    ...body,
  };
  return validateIdIfRequired(body, newObject)
    .then(() => validateOrganisationTO(to as OrganisationTO))
    .then((to: OrganisationTO) => 
      selectUserById(db, to.contactUser).then((user) => {
        if (user) {
          return to;
        }
        throw new UserNotFoundError(`User ${to.contactUser} not found`);
      }));
};

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
}

const validateOrganisationId = (idParam: string | string[]): number => {
  return validateId<OrganisationId>(idParam, false);
};

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, 'organisationId', Record<string, unknown>>) => {
  console.log('/organisation GET entrypoint: ', context.request.url);
  if (context.request.headers.get('content-type') !== 'application/json') {
    return onHtmlRequest(context);
  }
  if (context.request.method === 'POST') {
    return onJsonRequestPost(context);
  } else if (context.request.method === 'PUT') {
      return onJsonRequestPut(context);
  } else {
    return onJsonRequestGet(context);
  }
};

export const onPost: PagesFunction<Env> = async (context: EventContext<Env, 'organisationId', Record<string, unknown>>) => {
  console.log('/organisation POST entrypoint: ', context.request.url);
  if (context.request.headers.get('content-type') !== 'application/json') {
    return notAllowedMethodHandler(context);
  }
  return onJsonRequestPost(context);
}

export const onJsonRequestGet: PagesFunction<Env> = async (context: EventContext<Env, never | 'organisationId', Record<string, unknown>>) => {
  console.log(`organisation/onRequest called with GET from ${context.request.url}`, context.params.organisationId);
  if (context.params.organisationId === 'all') {
    return onJsonRequestGetAll(context);
  }
  const organisationId: number = validateOrganisationId(context.params.organisationId);

  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

  const result = await selectOrganisationById(db, organisationId);
  return resultForModelObject(context, result);
};

export const onJsonRequestPut: PagesFunction<Env> = async (
  context: EventContext<Env, 'organisationId', Record<string, unknown>>
): Promise<Response> => 
  processGenericPut<
    'organisationId',
    EventContext<Env, 'organisationId', Record<string, unknown>>,
    OrganisationId,
    OrganisationTO
  >(context, validateOrganisationBody, updateOrganisation);

export const onJsonRequestPost: PagesFunction<Env> = async (
  context: EventContext<Env, 'organisationId', Record<string, unknown>>
): Promise<Response> => {
  // return context.request.json()
  //   .then((body: unknown) => body as Record<string, unknown>)
  //   .then((body) => {
  //     return validateOrganisationBody(body, true)
  //       .then((to: OrganisationTO) => 
          
          
  return processGenericPost<
          'organisationId',
          EventContext<Env, 'organisationId', Record<string, unknown>>,
          OrganisationId,
          OrganisationTO
          >(context, validateOrganisationBody, createOrganisation);
    // try {
    //   const to = validate(body as Record<string, unknown>);
    // } catch (err: unknown) {
    //   if (err instanceof ValidationError) {
    //     console.error('Error validating body', err, body);
    //     return Response.error();
    //   }
    //   console.error('Error validating body', err);
    //   return Response.error();
    // }
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const anyToId = (to as any).id;
    // if (anyToId) {
    //   console.warn('POST request with ID:', anyToId);
    //   return Response.error();
    // }


    // validateHasNoId(body as Record<string, unknown>)
  //     .then(validateOrganisationBody)
  //     .catch((err) => { 
  //       if (err instanceof ValidationError) {
  //         console.error('Error validating body', err, body);
  //         return Response.json(body,
  //           { status: 400 }
  //         );
  //       }
  //       throw err;
  //     });


  //     .then((to) => {
  //     })
  // }).catch((err) => {
  //     if (err instanceof ValidationError) {
  //       console.error('Error validating body', err, body);
  //       return Response.error();
  //     }

  //   console.error(err.message, err);
  //   console.trace(err);
  //   const body = {
  //     message: 'Error creating object',
  //     status: 500,
  //   }
  //   return Response.json(body,
  //     { status: 500 }
  //   );
  //   return Response.json()
  // });
};

export default onRequest;
