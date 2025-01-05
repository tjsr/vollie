import { Env, VollieDrizzleConnection } from "../../../src/types";
import { EventId, validateId } from "../../../src/model/id";
import { createEvent, selectEventById, updateEvent } from "../../../src/orm/drizzle/queries/raceevent";
import { onHtmlRequest, resultForModelObject } from '../../../src/functionUtils';
import { processGenericPost, processGenericPut, validateIdIfRequired } from "../generic";

import { DBType } from "../../../src/orm/types";
import { RaceEventTO } from "../../../src/model/to";
import { getDbConnectionFromEnv } from "../../../src/orm";

// import { * as html } from '../index.html' as string;



// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const validateEventBody = async (
  _db: DBType,
  body: Record<string, unknown>,
  isNew: boolean
): Promise<RaceEventTO> => {
    return validateIdIfRequired(body, isNew)
      .then(() => {  
    const to: Partial<RaceEventTO> = {
      ...body,
    };
    return to as RaceEventTO;
  });
};

const validateEventId = (idParam: string | string[]): number => {
  return validateId<EventId>(idParam, false);
};

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
  console.log('/event entrypoint: ', context.request.url);
  try {
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
  } catch (err) {
    console.error(err);
    return Response.error();
  }
};

export const onJsonRequestGet: PagesFunction<Env> = async (context: EventContext<Env, 'eventId', Record<string, unknown>>): Promise<Response> => {
  console.log(`event onRequest GET ${context.request.url} called`, context.params.eventId);
  if (context.params.eventId === 'new') {
    return Response.json({ });
  }
  const eventId: number = validateEventId(context.params.eventId);

  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

  const result = await selectEventById(db, eventId);
  return resultForModelObject(context, result);
};


export const onJsonRequestPut: PagesFunction<Env> = async (
  context: EventContext<Env, 'eventId', Record<string, unknown>>
): Promise<Response> => 
  processGenericPut<
    'eventId',
    EventContext<Env, 'eventId', Record<string, unknown>>,
    EventId,
    RaceEventTO
  >(context, validateEventBody, updateEvent);
//   {
//   const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

//   console.log('onRequest called with POST');
//   return context.request.json().then((body: unknown) => {
//     console.debug(body);

//     const to = validateEventBody(body as Record<string, unknown>);
//     if (!to.id) {
//       console.warn('PUT request without ID:', to.id);
//       return Response.error();
//     }
//     return updateEvent(db, to)
//       .then((result) => Response.json(result))
//       .catch((err) => {
//         console.error(err);
//         return Response.error();
//       });
//   }).catch((err: unknown) => {
//     console.error('Error while converting event payload to JSON', err);
//     throw err;
//   });
// };

export const onJsonRequestPost: PagesFunction<Env> = async (
  context: EventContext<Env, 'eventId', Record<string, unknown>>
): Promise<Response> =>
  processGenericPost<
    'eventId',
    EventContext<Env, 'eventId', Record<string, unknown>>,
    EventId,
    RaceEventTO
    // NewTO extends Uninitialised<unknown> = Uninitialised<unknown>
  >(context, validateEventBody, createEvent);
// {
//   const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

//   console.log('onRequest called with POST');
//   return context.request.json().then((body: unknown) => {
//     console.debug(body);

//     const to = validateEventBody(body as Record<string, unknown>);
//     if (to.id) {
//       console.warn('POST request with ID:', to.id);
//       return Response.error();
//     }
//     return createEvent(db, to)
//       .then((result) => Response.json(result))
//       .catch((err) => {
//         console.error(err);
//         return Response.error();
//       });
//   }).catch((err: unknown) => {
//     console.error('Error while converting event payload to JSON', err);
//     throw err;
//   });
// };
