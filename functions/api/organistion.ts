import { Env, notYetImplementedRequestHandler, onHtmlRequest, resultForModelObject } from "../../src/functionUtils";
import { OrganisationId, validateId } from "../../src/model/id";

import { VollieDrizzleConnection } from "../../src/types";
import { getDbConnectionFromEnv } from "../../src/orm";
import { onJsonRequestGet as onJsonRequestGetAll } from './organisations';
import { selectOrganisationById } from "../../src/orm/drizzle/queries/organistion";

const onJsonRequestPost = notYetImplementedRequestHandler;

const validateOrganisationId = (idParam: string | string[]): number => {
  return validateId<OrganisationId>(idParam, false);
};

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, 'organisationId', Record<string, unknown>>) => {
  if (context.request.headers.get('content-type') !== 'application/json') {
    return onHtmlRequest(context);
  }
  if (context.request.method === 'POST') {
    return onJsonRequestPost(context);
  } else {
    return onJsonRequestGet(context);
  }
};

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