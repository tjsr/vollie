import { DBType, VollieDBConnection } from "../../src/orm/types";
import { IdType, validateId } from "../../src/model/id";
import { onHtmlRequest, resultForModelObject } from "../../src/functionUtils";

import { Env } from "../../src/types";
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
  update: (db: VollieDBConnection, to: Existing) => Promise<IdType>,
): Promise<Response> => {
  const db: VollieDBConnection = getDbConnectionFromEnv(context.env);

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

export const processGenericJsonPut = async <
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

  console.log(processGenericJsonPut, context.request.method, context.request.url);
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

export const processGenericJsonPost = <
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

  console.log(processGenericJsonPost, context.request.url, context.request.method);
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

  const db: VollieDBConnection = getDbConnectionFromEnv(context.env);

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
          return processGenericJsonPost<
            idKey,
            EventContext<Env, idKey, Record<string, unknown>>,
            Id,
            TO
          >(context, api.validateBody, api.create);
      } else if (context.request.method === 'PUT') {
        return processGenericJsonPut<
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

const methodNotAllowed = (
  contentType: string = 'application/json',
): Response => {
  const message = 'Method not allowed';
  const body = contentType === 'application/json' ? JSON.stringify({ message: message }) : `<h1>${message}</h1>`;

  const response = new Response(body, {
    status: 405,
    headers: {
      'content-type': contentType,
    },
  });
  return response;
};

const htmlResponse = async (
  context: EventContext<Env, string, Record<string, unknown>>,
): Promise<Response | undefined> => {
  const contentType: string|null = context.request.headers.get('content-type');
  if (contentType === 'text/html' && context.request.method !== 'GET') {
    return methodNotAllowed('test/html');
  }
  if (contentType !== 'application/json') {
    return onHtmlRequest(context);
  }
  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _requireContentType = async (
  context: EventContext<Env, string, Record<string, unknown>>,
  requiredContentType: string = 'application/json'
): Promise<Response | undefined> => {
  const contentType: string|null = context.request.headers.get('content-type');
  if (contentType !== requiredContentType) {
    return methodNotAllowed(requiredContentType);
  }
  return undefined;
};

const jsonMethodError = async (
  context: EventContext<Env, string, Record<string, unknown>>,
  expectedMethod: string = 'POST'
): Promise<Response | undefined> => {
  if (context.request.method !== expectedMethod) {
    const response = new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
      },
    });
    return response;
  }
};

const selectFirstResponsePromise = async (...promises: Promise<Response|undefined>[]): Promise<Response> => {
  for (let i = 0;i < promises.length;i++) {
    try {
      const response = await promises[i];
      if (response !== undefined) {
        return response;
      }
    } catch (err) {
      console.error(selectFirstResponsePromise, err);
    }
  }
  return new Response(null, { status: 400, headers: { 'content-type': 'application/json' } });
};

export const genericOnPost = async <
  Id extends IdType = IdType,
  TO extends WithId<Id, unknown> = WithId<Id, unknown>,
  idKey extends string = 'id'
>(
  context: EventContext<Env, idKey, Record<string, unknown>>,
  validateBody: (db: DBType, body: Record<string, unknown>, isNew: boolean) => Promise<TO>,
  create: (db: DBType, to: TO) => Promise<TO>
): Promise<Response> => {
  const response = selectFirstResponsePromise(
    htmlResponse(context),
    jsonMethodError(context, 'POST'),
    processGenericJsonPost<
      idKey,
      EventContext<Env, idKey, Record<string, unknown>>,
      Id,
      TO
    >(context, validateBody, create)
  );
  
  return response;
};

export const genericOnPut = async <
ObjectId extends IdType = IdType,
  idKey extends string = 'id',
  Existing extends WithId<ObjectId, unknown> = WithId<ObjectId, unknown>
>(
  context: EventContext<Env, idKey, Record<string, unknown>>,
  validateBody: (db: DBType, body: Record<string, unknown>, isNew: boolean) => Promise<Existing>,
  update: (db: DBType, to: Existing) => Promise<ObjectId>
): Promise<Response> => {
  const response = selectFirstResponsePromise(
    htmlResponse(context),
    jsonMethodError(context, 'PUT'),
    processGenericJsonPut<
      idKey,
      EventContext<Env, idKey, Record<string, unknown>>,
      ObjectId,
      Existing
    >(context, validateBody, update)
  );
  
  return response;
};
