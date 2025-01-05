import { Env, VollieDrizzleConnection } from "../../src/types";
import { OrganisationId, SeriesId, validateId } from "../../src/model/id";
import { SeriesTO, TransferObject } from "../../src/model/to";
import { createSeries, selectSeries, updateSeries } from "../../src/orm/drizzle/queries/series";
import { onHtmlRequest, resultForModelObject } from "../../src/functionUtils";
import { processGenericPost, processGenericPut, validateIdIfRequired } from "./generic";

import { DBType } from "../../src/orm/types";
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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const _validateSeriesId = (idParam: string | string[]): number => {
//   return validateId<SeriesId>(idParam, false);
// };

export const validateSeriesBody = async (
  _db: DBType,
  body: Record<string, unknown>,
  isNew: boolean
): Promise<TransferObject<SeriesTO>> => {
  return validateIdIfRequired(body, isNew)
    .then(() => {
      const to: Partial<SeriesTO> = {
        name: body['name'] as string,
        description: body['description'] as string,
        organiser: body['organiser'] as OrganisationId,
      };
      if (body['id'] !== undefined) {
        to.id = body['id'] as SeriesId;
        return to as SeriesTO;
      }
      return to as SeriesTO;
    });
};

export const onJsonRequestPut: PagesFunction<Env> = async (
  context: EventContext<Env, 'seriesId', Record<string, unknown>>
): Promise<Response> => 
  processGenericPut<
    'seriesId',
    EventContext<Env, 'seriesId', Record<string, unknown>>,
    SeriesId,
    SeriesTO
  >(context, validateSeriesBody, updateSeries);

export const onJsonRequestPost: PagesFunction<Env> = async (
  context: EventContext<Env, 'seriesId', Record<string, unknown>>
): Promise<Response> =>
  processGenericPost<
    'seriesId',
    EventContext<Env, 'seriesId', Record<string, unknown>>,
    SeriesId,
    SeriesTO
    // NewTO extends Uninitialised<unknown> = Uninitialised<unknown>
  >(context, validateSeriesBody, createSeries);

// export const onJsonRequestPost: PagesFunction<Env> = async (context: EventContext<Env, 'seriesId', Record<string, unknown>>): Promise<Response> => {
//   return onGenericJsonRequestPost(createSeries, updateSeries, validateSeriesBody, context);
// };

// export const onGenericJsonRequestPost = async <TOBase, ID extends IdType, TO extends TransferObject<TOBase, ID>>(
//   createFn: CreateFunction<TOBase>,
//   updateFn: UpdateFunction<TO, ID>,
//   validateFn: BodyValidateFunction<TO, ID>,
//   context: EventContext<Env, string|never, Record<string, unknown>>): Promise<Response> => {
//   const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

//   console.log('series', 'onRequest called with POST');
//   return context.request.json().then((body) => {
//     const { created, updated } = validateFn(body as Record<string, unknown>);
//     const createOrUpdate = created ? createFn(db, created) : updateFn(db, updated!);
//     return createOrUpdate
//       .then((result) => Response.json(result))
//       .catch((err) => {
//         console.error(err);
//         return Response.error();
//       });
//   }).catch((err) => {
//     console.error(err);
//     throw err;
//   });
// };
