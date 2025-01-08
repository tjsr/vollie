import { Env, notAllowedMethodHandler } from "../../../src/functionUtils";

import { onRequest as indexRequest } from "./index";

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
  if (context.request.method !== 'GET' && context.request.headers.get('content-type') !== 'application/json') {
    console.warn('Rejected: /user/:userId entrypoint:', context.params.userId, context.request.url, context.request.method, context.request.headers.get('content-type'));
    return notAllowedMethodHandler(context);
  }
  console.log('/user/:userId entrypoint:', context.params.userId, context.request.url, context.request.method, context.request.headers.get('content-type'));

  return indexRequest(context);
};
