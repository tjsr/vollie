import { Env } from "../../../src/types";
import { onRequest as indexRequest } from "./index";
import { notAllowedMethodHandler } from "../../../src/functionUtils";

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
  if (context.request.method === 'POST' && context.request.headers.get('content-type') !== 'application/json') {
    console.warn('Rejected: /event/:eventId entrypoint:', context.params.eventId, context.request.url, context.request.method, context.request.headers.get('content-type'));
    return notAllowedMethodHandler(context);
  }
  console.log('/event/:eventId entrypoint:', context.params.eventId, context.request.url, context.request.method, context.request.headers.get('content-type'));

  return indexRequest(context);
};
