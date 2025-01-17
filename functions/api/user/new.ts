import { notAllowedMethodHandler, onHtmlRequest } from "../../../src/functionUtils";

import { Env } from "../../../src/types";

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
  console.log('/api/user/new entrypoint: ', context.request.url);
  if (context.request.headers.get('content-type') === 'application/json' && context.request.method !== 'POST') {
    return notAllowedMethodHandler(context);
  }
  return onHtmlRequest(context);
};
