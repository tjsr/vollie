import { Env } from "../../types";
import { onRequest as indexRequest } from "./index";
import { notAllowedMethodHandler } from "../../../src/functionUtils";

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
  if (context.request.method !== 'GET' && context.request.headers.get('content-type') !== 'application/json') {
    console.warn(onRequest, context.request.method, context.request.url, 'Rejected: /api/user/:userId entrypoint:', context.params.userId, context.request.headers.get('content-type'));
    return notAllowedMethodHandler(context);
  }
  console.log(onRequest, context.request.method, context.request.url, '/api/user/:userId entrypoint:', context.params.userId, context.request.headers.get('content-type'));

  return indexRequest(context);
};
