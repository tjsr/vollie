import { ApiModelContext, generateOnRequest, validateIdIfRequired } from "../generic";
import { createEvent, selectEventById, updateEvent } from "../../../src/orm/drizzle/queries/raceevent";

import { DBType } from "../../../src/orm/types";
import { Env } from "../../../src/types";
import { EventId } from "../../../src/model/id";
import { RaceEventTO } from "../../../src/model/to";
import { onHtmlRequest } from '../../../src/functionUtils';

// import { * as html } from '../index.html' as string;

type EventIdKey = 'eventId';
// type RaceEventContext = EventContext<Env, EventIdKey, Record<string, unknown>>;

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

export const oldOnRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
  console.log('/event entrypoint: ', context.request.url);
  try {
    if (context.request.headers.get('content-type') !== 'application/json') {
      return onHtmlRequest(context);
    }
    // if (context.request.method === 'POST') {
    //   return onJsonRequestPost(context);
    // } else if (context.request.method === 'PUT') {
    //   return onJsonRequestPut(context);
    // } else {
    // return procesGenericGetById(context);
      return Response.json({});
    // }
  } catch (err) {
    console.error(err);
    return Response.error();
  }
};

const api: ApiModelContext<RaceEventTO, EventId> = {
  entrypoint: '/event',
  idParam: 'eventId',
  // validateId: validateEventId,
  validateBody: validateEventBody,
  create: createEvent,
  select: selectEventById,
  update: updateEvent,
};

export const onRequest: PagesFunction<Env> = generateOnRequest<EventId, RaceEventTO, EventIdKey>(api);


// const onJsonRequestPut: PagesFunction<Env> = async (
//   context: RaceEventContext
// ): Promise<Response> =>
//   processGenericPut<
//     EventIdKey,
//     RaceEventContext,
//     EventId,
//     RaceEventTO
//   >(context, validateEventBody, updateEvent);


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

// const onJsonRequestPost: PagesFunction<Env> = async (
//   context: EventContext<Env, 'eventId', Record<string, unknown>>
// ): Promise<Response> =>
//   processGenericPost<
//     EventIdKey,
//     RaceEventContext,
//     EventId,
//     RaceEventTO
//     // NewTO extends Uninitialised<unknown> = Uninitialised<unknown>
//   >(context, validateEventBody, createEvent);

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
