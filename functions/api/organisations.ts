import { Env, notAllowedMethodHandler, onHtmlRequest } from "../../src/functionUtils";

import { VollieDrizzleConnection } from "../../src/types";
import { getDbConnectionFromEnv } from "../../src/orm";
import { organisationSelectAll } from "../../src/orm/drizzle/queries/organistion";

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, 'organisationId', Record<string, unknown>>) => {
  console.log('/organisations entrypoint: ', context.request.url);
  if (context.request.headers.get('content-type') !== 'application/json') {
    return onHtmlRequest(context);
  }

  if (context.request.method=== 'GET') {
    return onJsonRequestGet(context);
  }
  return notAllowedMethodHandler(context);
};

export const onJsonRequestGetAll: PagesFunction<Env> = async (context: EventContext<Env, never, Record<string, unknown>>) => {
  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);
  if (context.request.method !== 'POST') {
    return Response.error();
  }

  const result = await organisationSelectAll(db);
  console.log('organisations/onRequest called with GET');
  return Response.json(result);
};

export const onJsonRequestGet: PagesFunction<Env> = async (context: EventContext<Env, never, Record<string, unknown>>) => {
  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

  const result = await organisationSelectAll(db);
  return Response.json(result);
};
