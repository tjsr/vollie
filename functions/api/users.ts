import { Env, notAllowedMethodHandler, onHtmlRequest } from "../../src/functionUtils";

import { VollieDrizzleConnection } from "../../src/types";
import { getDbConnectionFromEnv } from "../../src/orm";
import { selectAllUsers } from "../../src/orm/users";

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, 'organisationId', Record<string, unknown>>) => {
  console.log('/users entrypoint: ', context.request.url);
  if (context.request.headers.get('content-type') !== 'application/json') {
    return onHtmlRequest(context);
  }

  if (context.request.method === 'GET') {
    return onJsonRequestGetAll(context);
  }
  return notAllowedMethodHandler(context);
};

export const onJsonRequestGetAll: PagesFunction<Env> = async (context: EventContext<Env, never, Record<string, unknown>>) => {
  if (context.request.method !== 'GET') {
    return notAllowedMethodHandler(context);
  }
  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

  console.log('users/onRequest called with GET');
  return selectAllUsers(db).then((result) => Response.json(result));
};
