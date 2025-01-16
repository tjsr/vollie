import { Env, VollieDrizzleConnection } from "../../src/types";
import { IdType, validateId } from "../../src/model/id";
import { onHtmlRequest, resultForModelObject } from "../../src/functionUtils";

import { DBType } from "../../src/orm/types";
import { Existing } from "../../src/model/to";
import { ValidationError } from "../../src/model/errors";
import { WithId } from "../../src/orm/drizzle/idTypes";
import { getDbConnectionFromEnv } from "../../src/orm";

export type ApiModelContext<TO, Id extends IdType> = {
  entrypoint: string;
  idParam: string;
  validateId?: (idParam: string | string[]) => Id;
  validateBody: (db: DBType, body: Record<string, unknown>, isNew: boolean) => Promise<TO>;
  create: (db: DBType, to: TO) => Promise<TO>;
  select: (db: DBType, id: Id) => Promise<WithId<Id, unknown>|undefined>;
  update: (db: DBType, to: TO) => Promise<Id>;
};

const validateHasNoId = async (body: Record<string, unknown>): Promise<Record<string, unknown>> => {
  if (body['id'] !== undefined) {
    throw new Error('Body contains an ID');
  }
  return body;
};

const validateHasId = async (body: Record<string, unknown>): Promise<Record<string, unknown>> => {
  if (body['id'] === undefined || body['id'] === null) {
    throw new Error('Body contains no ID');
  }
  return body;
};

export const validateIdIfRequired = async (body: Record<string, unknown>, newObject: boolean): Promise<Record<string, unknown>> =>
  newObject ? validateHasNoId(body) : validateHasId(body);

const buildResponseFromError = (err: unknown, requestBody: unknown): Response => {
  let status = 500;
  let message = 'Error creating object';
  if (err instanceof ValidationError) {
    message = 'Error validating body';
    console.error('Error validating body', err, requestBody);
    status = 400;
  } else if (err instanceof Error) {
    console.trace(err.message, err, requestBody);
    console.error(err.message, err);
  } else {
    console.error('Unknown error from request', err, requestBody);
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

  console.log(processGenericPut, context.request.method, context.request.url);
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

  console.log(processGenericPost, context.request.url, context.request.method);
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

export const procesGenericGetById = async <
  CtxType extends EventContext<Env, IdRequestParam, Record<string, unknown>> = EventContext<Env, string, Record<string, unknown>>,
  IdRequestParam extends string = 'id',
  ObjectId extends IdType = IdType,
  Existing extends WithId<ObjectId, unknown> = WithId<ObjectId, unknown>
>(
  context: CtxType,
  idParam: IdRequestParam,
  validateIdFn: (idParam: string | string[]) => ObjectId = validateId,
  selectById: (db: DBType, id: ObjectId) => Promise<Existing|undefined>,
): Promise<Response> => {
  const params: Params<IdRequestParam> = context.params;
  const idParamValue = params[idParam];
  console.log(procesGenericGetById, context.request.method, context.request.url, `generic onRequest GET called`, idParamValue);
  if (context.params[idParam] as string === 'new') {
    return Response.json({});
  }

  const validatedId: ObjectId = validateIdFn(idParamValue);

  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

  return selectById(db, validatedId).then((result) => resultForModelObject(context, result));
};

export const generateOnRequest = <
  Id extends IdType = IdType,
  TO extends WithId<Id, unknown> = WithId<Id, unknown>,
  idKey extends string = 'id'
  >(
    api: ApiModelContext<TO, Id>
): PagesFunction<Env> => {
const returnFunc: PagesFunction<Env> = async (
    context: EventContext<Env, idKey, Record<string, unknown>>
  ): Promise<Response> => {
    console.log(generateOnRequest, context.request.method, context.request.url, `${api.entrypoint} entrypoint: ${context.request.url}`);
    try {
      if (context.request.headers.get('content-type') !== 'application/json') {
        return onHtmlRequest(context);
      }
      if (context.request.method === 'POST') {
          return processGenericPost<
            idKey,
            EventContext<Env, idKey, Record<string, unknown>>,
            Id,
            TO
          >(context, api.validateBody, api.create);
      } else if (context.request.method === 'PUT') {
        return processGenericPut<
          idKey,
          EventContext<Env, idKey, Record<string, unknown>>,
          Id,
          TO
        >(context, api.validateBody, api.update);
      } else {
        return procesGenericGetById(context, api.idParam, api.validateId, api.select);
      }
    } catch (err) {
      console.error(generateOnRequest, context.request.method, context.request.url, err);
      return Response.error();
    }  
  };
  return returnFunc;
};