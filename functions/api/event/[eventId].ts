import { NewRaceEventTO, RaceEventTO } from "../../../src/model/to";

import { Env } from "../../../src/types";
import { onRequest as indexRequest } from "./index";
import { notAllowedMethodHandler } from "../../../src/functionUtils";

export const onNewRequest: PagesFunction<Env, 'new', NewRaceEventTO> = async (context: EventContext<Env, 'new', NewRaceEventTO>): Promise<Response> => {
  console.log(onNewRequest, 'Got [eventId]=new');
  const outputEvent: RaceEventTO = {
    ...context.data,
    id: 123,
  };
  return Promise.resolve(new Response(JSON.stringify(outputEvent), { status: 200, headers: { 'Content-Type': 'application/json' } }));
};


export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
  if (context.request.method !== 'GET' && context.request.headers.get('content-type') !== 'application/json') {
    console.warn('Rejected: /event/:eventId entrypoint:', context.params.eventId, context.request.url, context.request.method, context.request.headers.get('content-type'));
    return notAllowedMethodHandler(context);
  }
  console.log('/event/:eventId entrypoint:', context.params.eventId, context.request.url, context.request.method, context.request.headers.get('content-type'));

  return indexRequest(context);
};
