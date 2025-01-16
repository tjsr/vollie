import { Env, notAllowedMethodHandler } from "../../../src/functionUtils";

import { onRequest as indexRequest } from "./index";

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
  if (context.request.method !== 'GET' && context.request.headers.get('content-type') !== 'application/json') {
    console.warn(onRequest, context.request.method, context.request.url, 'Rejected: /user/:userId entrypoint:', context.params.userId, context.request.headers.get('content-type'));
    return notAllowedMethodHandler(context);
  }
  console.log(onRequest, context.request.method, context.request.url, '/user/:userId entrypoint:', context.params.userId, context.request.headers.get('content-type'));

  return indexRequest(context);
};
