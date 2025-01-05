import { Env, VollieDrizzleConnection } from "../../src/types";

import { DBType } from "../../src/orm/types";
import { Existing } from "../../src/model/to";
import { IdType } from "../../src/model/id";
import { ValidationError } from "../../src/model/errors";
import { WithId } from "../../src/orm/drizzle/idTypes";
import { getDbConnectionFromEnv } from "../../src/orm";

const validateHasNoId = async (body: Record<string, unknown>): Promise<Record<string, unknown>> => {
  if (body['id'] !== undefined) {
    throw new Error('Body contains an ID');
  }
  return body;
};

export const validateIdIfRequired = async (body: Record<string, unknown>, newObject: boolean): Promise<Record<string, unknown>> =>
  newObject ? validateHasNoId(body) : Promise.resolve(body);

const buildResponseFromError = (err: unknown, requestBody: unknown): Response => {
  let status = 500;
  let message = 'Error creating object';
  if (err instanceof ValidationError) {
    message = 'Error validating body';
    console.error('Error validating body', err, requestBody);
    status = 400;
  } else if (err instanceof Error) {
    console.trace(err.message, err);
    console.error(err.message, err);
  }
  const responseBody = {
    message,
    status,
  };
  return Response.json(responseBody,
    { status }
  );
};

export const processGenericPutOld = async <
  idField extends string = 'id',
  CtxType extends EventContext<Env, idField, Record<string, unknown>> = EventContext<Env, idField, Record<string, unknown>>,
  ObjectId extends IdType = IdType,
  Existing extends WithId<ObjectId, unknown> = WithId<ObjectId, unknown>
>(
  context: CtxType,
  validate: (body: Record<string, unknown>) => Existing,
  update: (db: VollieDrizzleConnection, to: Existing) => Promise<IdType>,
): Promise<Response> => {
  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

  console.log('onRequest called with PUT');
  return context.request.json().then((body: unknown) => {
    console.debug(body);

    const to = validate(body as Record<string, unknown>);
    if (!to.id) {
      console.warn('PUT request without ID:', to.id);
      return Response.error();
    }
    return update(db, to)
      .then((result) => Response.json(result))
      .catch((err) => {
        console.error(err.message, err);
        console.trace(err);
        const body = {
          message: 'Error creating object',
          status: 500,
        }
        return Response.json(body,
          { status: 500 }
        );
     });
  }).catch((err: unknown) => {
    console.error('Error while converting payload to JSON', err);
    const body = {
      message: 'Error creating object',
      status: 500,
    }
    return Response.json(body,
      { status: 500 }
    );
});
};

export const processGenericPut = async <
  idField extends string = 'id',
  CtxType extends EventContext<Env, idField, Record<string, unknown>> = EventContext<Env, idField, Record<string, unknown>>,
  ObjectId extends IdType = IdType,
  Existing extends WithId<ObjectId, unknown> = WithId<ObjectId, unknown>
>(
  context: CtxType,
  validate: (db: DBType, body: Record<string, unknown>, isNew: false) => Promise<Existing>,
  update: (db: DBType, to: Existing) => Promise<IdType>,
): Promise<Response> => {
  const db: DBType = getDbConnectionFromEnv(context.env);

  console.log(processGenericPut, 'onRequest called with POST');
  return context.request.json()
    .then((requestBody: unknown) => requestBody as Record<string, unknown>)
    .then((requestBody) => 
      validate(db, requestBody, false)
        .then((to: Existing) => 
          update(db, to)
            .then((result) => Response.json(result)))
        .catch((err) => buildResponseFromError(err, requestBody))
  );
};

export const processGenericPost = <
  idField extends string = 'id',
  CtxType extends EventContext<Env, idField, Record<string, unknown>> = EventContext<Env, idField, Record<string, unknown>>,
  Id extends IdType = IdType,
  NewTO extends Existing<unknown, Id> = Existing<unknown, Id>
>(
  context: CtxType,
  validate: (db: DBType, body: Record<string, unknown>, isNew: true) => Promise<NewTO>,
  create: (db: DBType, to: NewTO) => Promise<NewTO>,
): Promise<Response> => {
  const db: DBType = getDbConnectionFromEnv(context.env);

  console.log(`onRequest ${context.request.url} called with POST`);
  return context.request.json()
    .then((requestBody: unknown) => requestBody as Record<string, unknown>)
    .then((requestBody) => 
      validate(db, requestBody, true)
        .then((to: NewTO) => 
          create(db, to)
            .then((result) => Response.json(result)))
        .catch((err) => buildResponseFromError(err, requestBody))
    );
};
