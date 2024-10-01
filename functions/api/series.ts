import { BodyValidateFunction, CreateFunction, UpdateFunction, ValidatedTOs, onHtmlRequest, resultForModelObject } from "../../src/functionUtils";
import { Env, VollieDrizzleConnection } from "../../src/types";
import { Existing, SeriesTO, TransferObject, Uninitialised } from "../../src/model/to";
import { IdType, OrganisationId, SeriesId, validateId } from "../../src/model/id";
import { createSeries, selectSeries, updateSeries } from "../../src/orm/drizzle/queries/series";

import { getDbConnectionFromEnv } from "../../src/orm";
import { selectSeriesById } from "../../src/orm/drizzle/queries/series";

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
  try {
    if (context.request.headers.get('content-type') !== 'application/json') {
      return onHtmlRequest(context);
    }
    if (context.request.method === 'POST') {
      return onJsonRequestPost(context);
    } else {
      return onJsonRequestGet(context);
    }
  } catch (err) {
    console.error(err);
    return Response.error();
  }
};

export const onJsonRequestGet: PagesFunction<Env> = async (context: EventContext<Env, 'seriesId', Record<string, unknown>>): Promise<Response> => {
  console.log(`series/onRequest called with GET from ${context.request.url}`, context.params.seriesId || '');
  if (context.params.seriesId === 'new') {
    return Response.json({ });
  }

  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);
  if (!context.params.seriesId) {
    const result = await selectSeries(db);
    return Response.json(result);
  }
  const seriesId: SeriesId = validateId(context.params.seriesId);

  const result = await selectSeriesById(db, seriesId);
  return resultForModelObject(context, result);
};

export const validateSeriesBody: BodyValidateFunction<SeriesTO, SeriesId> = (body: Record<string, unknown|undefined>): ValidatedTOs<SeriesTO, SeriesId> => {
  const to: Partial<SeriesTO> = {
    name: body['name'] as string,
    description: body['description'] as string,
    organiser: body['organiser'] as OrganisationId,
  };
  if (body['id'] !== undefined) {
    to.id = body['id'] as SeriesId;
    return { updated: to as Existing<SeriesTO, SeriesId> };
  }
  return { created: to as Uninitialised<SeriesTO> };
};

// const validateSeriesId = (idParam: string | string[]): number => {
//   return validateId<SeriesId>(idParam, false);
// };

export const onJsonRequestPost: PagesFunction<Env> = async (context: EventContext<Env, 'seriesId', Record<string, unknown>>): Promise<Response> => {
  return onGenericJsonRequestPost(createSeries, updateSeries, validateSeriesBody, context);
};

export const onGenericJsonRequestPost = async <TOBase, ID extends IdType, TO extends TransferObject<TOBase, ID>>(
  createFn: CreateFunction<TOBase>,
  updateFn: UpdateFunction<TO, ID>,
  validateFn: BodyValidateFunction<TO, ID>,
  context: EventContext<Env, string|never, Record<string, unknown>>): Promise<Response> => {
  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

  console.log('onRequest called with POST');
  const body = await context.request.json();
  const { created, updated } = validateFn(body);
  const createOrUpdate = created ? createFn(db, created) : updateFn(db, updated!);
  return createOrUpdate
    .then((result) => Response.json(result))
    .catch((err) => {
      console.error(err);
      return Response.error();
    });
};
