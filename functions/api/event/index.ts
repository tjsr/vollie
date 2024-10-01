import { Env, VollieDrizzleConnection } from "../../../src/types";
import { EventId, validateId } from "../../../src/model/id";
import { createEvent, selectEventById, updateEvent } from "../../../src/orm/drizzle/queries/raceevent";
import { onHtmlRequest, resultForModelObject } from '../../../src/functionUtils';

import { RaceEventTO } from "../../../src/model/to";
// import { * as html } from '../index.html' as string;
import { getDbConnectionFromEnv } from "../../../src/orm";

export const validateEventBody = (body: Record<string, unknown>): RaceEventTO => {
  const to: Partial<RaceEventTO> = {
    ...body,
  };
  return to as RaceEventTO;
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

export const onJsonRequestPost: PagesFunction<Env> = async (context: EventContext<Env, 'eventId', Record<string, unknown>>): Promise<Response> => {
  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);

  console.log('onRequest called with POST');
  const body = await context.request.json();
  const to = validateEventBody(body);
  const createOrUpdate = !to.id ? createEvent(db, to) : updateEvent(db, to);
  return createOrUpdate
    .then((result) => Response.json(result))
    .catch((err) => {
      console.error(err);
      return Response.error();
    });
};
