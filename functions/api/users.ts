import { VollieDBConnection, getDbConnectionFromEnv } from "../../src/orm";
import { notAllowedMethodHandler, onHtmlRequest } from "../../src/functionUtils";

import { Env } from "../types";
import { selectAllUsers } from "../../src/orm/users";

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, 'organisationId', Record<string, unknown>>) => {
  const contentType = context.request.headers.get('content-type');
  console.log(onRequest, '/users entrypoint: ', context.request.method, context.request.url, contentType);
  if (contentType !== 'application/json') {
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
  const db: VollieDBConnection = getDbConnectionFromEnv(context.env);

  console.log(onJsonRequestGetAll, 'users/onRequest called with GET');
  return selectAllUsers(db).then((result) => Response.json(result));
};
